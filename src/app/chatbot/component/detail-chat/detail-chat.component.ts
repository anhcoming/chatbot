import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ShareService} from "../../service/share.service";
import { ChatSessionService } from 'src/app/services/chatSession.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-detail-chat',
  templateUrl: './detail-chat.component.html',
  styleUrls: ['./detail-chat.component.scss']
})
export class DetailChatComponent {
    @ViewChild('scrollContainer') scrollContainer!: ElementRef; // Truy cập đến thẻ div chứa tin nhắn
    isLoading: boolean = false;
    id: any
    messages: any = [];
    visible = false
    dataOptions = [
        {name :  'Văn bản pháp luật',active:false},
        {name :  'Công văn giấy tờ',active:false},
        {name :  'Công chức nhà nước',active:false},
        {name :  'Hành chính công',active:false},
    ]
    constructor(private route: ActivatedRoute,private shareService:ShareService,
        private readonly _chatSessionService: ChatSessionService,
        public config: DynamicDialogConfig
    ) {
    }

    ngOnInit(): void {
        this.shareService.isMobile.subscribe((isMobile: boolean) => {
            this.visible = false
        })

        this.id = this.config.data.id;
        this.loadMessages();
    }

    exportDocx() {
        this._chatSessionService.exportDocx(this.id).subscribe((response: any) => {
            let fileName = 'Chat_' + this.id + '.docx';
            const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, (error) => {
            console.error(error);
        })
    }

    loadMessages(): void {
        this.messages = [
            {text: 'Chào bạn! Hôm nay bạn cần gì?', sender: 'agent'},
            {text: 'Chào bạn! Mình đang muốn tìm hiểu thêm về sản phẩm của bạn, cụ thể là các tính năng nổi bật và khả năng tích hợp với những công cụ khác mà mình đang sử dụng trong công việc hàng ngày.', sender: 'user'},
            {text: 'Tuyệt vời! Bạn muốn biết thêm về sản phẩm nào?', sender: 'agent'},
            {text: 'Mình đặc biệt quan tâm đến những tính năng chính của sản phẩm và cách mà sản phẩm này có thể giúp mình tối ưu hóa quy trình làm việc hiện tại. Bạn có thể giải thích chi tiết hơn về những lợi ích mà sản phẩm của bạn mang lại không?', sender: 'user'},
            {
                text: 'Sản phẩm của chúng tôi có nhiều tính năng hữu ích như quản lý dự án, báo cáo và tích hợp với các công cụ khác.',
                sender: 'agent'
            },
            {text: 'Cảm ơn bạn! Mình thấy rất ấn tượng với tính năng quản lý dự án và khả năng báo cáo. Tuy nhiên, mình muốn biết rõ hơn về cách tích hợp với các công cụ khác, vì mình đang sử dụng nhiều ứng dụng để hỗ trợ công việc.', sender: 'user'},
            {
                text: 'Chúng tôi hỗ trợ tích hợp với các công cụ như Slack, Trello, và Google Drive để giúp bạn quản lý dự án hiệu quả hơn. Bạn cũng có thể kết nối với các hệ thống khác qua API của chúng tôi.',
                sender: 'agent'
            },
            {text: 'Nghe thật tuyệt vời! Việc tích hợp với Slack và Trello chắc chắn sẽ giúp mình rất nhiều trong việc duy trì liên lạc và theo dõi tiến độ dự án. Mình muốn bắt đầu dùng thử sản phẩm để có thể trải nghiệm những tính năng này một cách thực tế.', sender: 'user'},
            {
                text: 'Tuyệt vời! Để bắt đầu dùng thử, bạn chỉ cần đăng ký tài khoản trên trang web của chúng tôi và bạn sẽ nhận được hướng dẫn chi tiết. Ngoài ra, nếu bạn có bất kỳ câu hỏi nào trong quá trình sử dụng, đừng ngần ngại liên hệ với chúng tôi.',
                sender: 'agent'
            },
            {text: 'Cảm ơn bạn. Mình sẽ đăng ký ngay để bắt đầu trải nghiệm. Ngoài ra, có bất kỳ thông tin gì thêm mà mình cần chuẩn bị trước khi dùng thử không?', sender: 'user'},
            {
                text: 'Chúng tôi sẽ gửi bạn một email xác nhận và hướng dẫn cài đặt. Bạn cũng sẽ nhận được các mẹo sử dụng và thông tin cập nhật về sản phẩm. Nếu có bất kỳ vấn đề nào, hãy liên hệ với đội hỗ trợ của chúng tôi.',
                sender: 'agent'
            },
            {text: 'Cảm ơn rất nhiều! Mình sẽ kiểm tra email và theo dõi các hướng dẫn mà bạn gửi. Hy vọng sản phẩm sẽ mang lại những giá trị thiết thực cho công việc của mình. Cảm ơn bạn vì sự hỗ trợ tận tình!', sender: 'user'},
            {text: 'Bạn có câu hỏi nào khác không?', sender: 'agent'},
            {text: 'Hiện tại thì không có thêm câu hỏi nào nữa. Mình cảm thấy rất hài lòng với thông tin mà bạn đã cung cấp. Cảm ơn bạn đã giúp đỡ!', sender: 'user'},
            {
                text: 'Chúc bạn một ngày tốt lành và hy vọng sản phẩm của chúng tôi sẽ giúp ích cho công việc của bạn!',
                sender: 'agent'
            }
        ];

        this._chatSessionService.getMessages(this.id).subscribe(
            (response) => {
                this.messages = response.data;
                // Cuộn xuống dư��i sau khi view đã được cập nhật
                // this.scrollToBottom(); 
            },
            (error) => {
                console.error(error);
            }
        );

    }

    ngAfterViewChecked() {
        this.scrollToBottom(); // Cuộn xuống dưới sau khi view đã được cập nhật
    }

    private scrollToBottom(): void {
        if (this.scrollContainer) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; // Đặt scrollTop bằng scrollHeight
        }
    }

}
