import { MailerService } from '@nest-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';

@Processor('orders')
export class OrderConsumer {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  @Process()
  async forgotPassword(job: Job) {
    try {
      const data = job.data;
      const total = () => {
        return data?.cart?.reduce((totalPrice, item) => {
          const itemPrice = Number(item?.paint?.price) * Number(item.amount);
          return totalPrice + itemPrice;
        }, 0);
      };

      // SENDMAIl
      await this.mailerService.sendMail({
        to: this.configService.get('MAIL_USER'),
        subject: `TRANH TƯỜNG MIỀN BẮC - ĐƠN HÀNG MỚI`,
        html: `<h1>Đơn hàng TRANH TƯỜNG MIỀN BẮC</h1>
        <p>Mã đơn hàng: ${data?._id}</p>
        <p>Khách hàng: ${data?.name}</p>
        <p>Số điện thoại: ${data?.phone}</p>
        <p>Địa chỉ: ${data?.address}</p>
        <p>Ghi chú: ${data?.note ? data?.note : 'không có ghi chú'}</p>
        <h3>Thông tin đơn hàng:</h3>
        <table style="border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid black; padding: 8px;">Tên sản phẩm</th>
            <th style="border: 1px solid black; padding: 8px;">Giá</th>
            <th style="border: 1px solid black; padding: 8px;">Số lượng</th>
            <th style="border: 1px solid black; padding: 8px;">Thành tiền</th>
          </tr>
          ${data?.cart
            .map(
              (item) => `
          <tr>
            <td style="border: 1px solid black; padding: 8px;">${
              item?.paint?.title
            }</td>
            <td style="border: 1px solid black; padding: 8px;">${
              item?.paint?.price
            }</td>
            <td style="border: 1px solid black; padding: 8px;">${
              item.amount
            }</td>
            <td style="border: 1px solid black; padding: 8px;">${
              Number(item.amount) * Number(item?.paint?.price)
            }</td>
          </tr>
        `,
            )
            .join('')}
            <tr>
              <td style="border: 1px solid black; padding: 8px; font-weight:600" colspan="3">Tổng tiền</td>
              <td style="border: 1px solid black; padding: 8px; font-weight:600">${total()}</td>
            </tr>
        </table>
        <p style="color: red;">Vui lòng vào website admin để xem thông tin chi tiết</p>
        `,
      });

      //SEND TELEGRAM
      const token = this.configService.get('TELEGRAM_TOKEN');
      const chat_id = this.configService.get('TELEGRAM_CHAT_ID');

      const teleProduct = data?.cart?.map(
        (e) => `%0ATên: ${e?.paint?.title} * SL: ${e?.amount}`,
      );

      const text = `Họ và tên: ${data?.name}
      %0ASố điện thoại: ${data?.phone}
      %0AĐịa chỉ: ${data?.address}
      %0AGhi chú: ${data?.note ? data?.note : ''}
      %0A
      %0A---------------- ĐƠN HÀNG ---------------
      ${teleProduct}
    `;

      const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${text}`;
      await this.httpService.axiosRef.post(url);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
