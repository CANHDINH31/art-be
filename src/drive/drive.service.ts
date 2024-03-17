import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as stream from 'stream';

@Injectable()
export class DriveService {
  private oauth2Client;
  constructor(private configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('DRIVE_CLIENT_ID'),
      this.configService.get('DRIVE_CLIENT_SECRET'),
      this.configService.get('DRIVE_REDIRECT_URI'),
    );
    this.oauth2Client.setCredentials({
      refresh_token: this.configService.get('DRIVE_REFRESH_TOKEN'),
    });
  }

  getDrive() {
    return google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  async uploadFile(file: Express.Multer.File, fileName?: string) {
    try {
      const driver = this.getDrive();
      const bufferStreamImg = new stream.PassThrough();
      bufferStreamImg.end(file.buffer);

      const folderId = await this.getFolderIdByName(
        this.configService.get('DRIVE_FOLDER_UPLOAD'),
      );

      if (folderId) {
        const data = await driver.files.create({
          media: {
            mimeType: file.mimetype,
            body: bufferStreamImg,
          },
          requestBody: {
            name: fileName || file.originalname,
            parents: [folderId],
          },
        });
        await this.setPublicFile(data.data.id);
        return data.data.id;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setPublicFile(fileId: string) {
    try {
      const driver = this.getDrive();
      await driver.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      const res = await driver.files.get({
        fileId,
        fields: 'webViewLink, webContentLink',
      });

      return res.data.webViewLink;
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(fileId: string) {
    const driver = this.getDrive();
    await driver.files.delete({ fileId });
  }

  async getFolderIdByName(folderName: string): Promise<string | null> {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
      fields: 'files(id)',
    });

    const folders = response.data.files;
    if (folders && folders.length > 0) {
      return folders[0].id;
    }

    return null;
  }
}
