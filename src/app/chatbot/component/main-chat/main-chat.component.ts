import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ShareService} from "../../service/share.service";
import {LocalstorageService} from "../../service/localstorage.service";
import { ChatbotTheme } from '../../chatbot.enum.ts/chatbot.enum';
import { TopicService } from 'src/app/services/topic.service';
import { ChatSessionService } from 'src/app/services/chatSession.service';
import { ChatbotService } from 'src/app/shared/services/chatbot.service';
import { MessageService } from 'primeng/api';
import { HttpHeaders } from '@angular/common/http';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StorageData } from 'src/app/shared/constants/app.constants';
import { DemoService } from 'src/app/services/demo.service';
import { ChatBotService } from '../../service/chat-bot.service';

interface Message {
    text: string;
    sender: 'user' | 'agent';
}

@Component({
    selector: 'app-main-chat',
    templateUrl: './main-chat.component.html',
    styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollContainer') scrollContainer!: ElementRef; // Truy cập đến thẻ div chứa tin nhắn
    isLoading: boolean = false;
    id: any
    messages: Message[] = [];
    currentOption:any
    visible = false;
    ChatbotTheme = ChatbotTheme;
    history: any;
    readonly: boolean = false;
    currentChatSession: any;
    question: string= '';
    dataOptions = [
        {name :  'Văn bản pháp luật',active:false, id:1},
        {name :  'Công văn giấy tờ',active:false, id:2},
        {name :  'Công chức nhà nước',active:false, id:3},
        {name :  'Hành chính công',active:false, id:4},
    ]
    selectedGroupTopic: any;
    constructor(private route: ActivatedRoute,private shareService:ShareService,public localstorageService:LocalstorageService,
        private readonly _topicService: TopicService,
        private readonly _chatSessionService: ChatSessionService,
		private _chatBotService: ChatbotService,
        private messageService: MessageService,
        private _storageService: StorageService,
		private readonly _demoService: DemoService,
        private router: Router,
        private chatbotService: ChatBotService,
    ) {
    }

    ngOnInit(): void {
        this.shareService.isMobile.subscribe((isMobile: boolean) => {
            this.visible = false
        })
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
            // Now you can use the id for fetching data or other purposes
            this.id && this.loadMessages();
        });

        this.id && this.loadMessages();
        this.dataOptions[0].active = true
        this.currentOption = this.dataOptions[0]


        this.chatbotService.eventHandle.subscribe(res => {
            /// Xử lý logic call api khi lắng nghe sự kiện chọn câu hỏi từ sidebar
            console.log(res, '-----');
        })
    }

    changeOption(item:any){
        this.dataOptions.forEach((x: any) => {
            x.active = item.name == x.name;
        })
        this.selectedGroupTopic = item
    }
    loadMessages(): void {
        // this.messages = [
        //     {text: 'Chào bạn! Hôm nay bạn cần gì?', sender: 'agent'},
        //     {text: 'Chào bạn! Mình đang muốn tìm hiểu thêm về sản phẩm của bạn, cụ thể là các tính năng nổi bật và khả năng tích hợp với những công cụ khác mà mình đang sử dụng trong công việc hàng ngày.', sender: 'user'},
        //     {text: 'Tuyệt vời! Bạn muốn biết thêm về sản phẩm nào?', sender: 'agent'},
        //     {text: 'Mình đặc biệt quan tâm đến những tính năng chính của sản phẩm và cách mà sản phẩm này có thể giúp mình tối ưu hóa quy trình làm việc hiện tại. Bạn có thể giải thích chi tiết hơn về những lợi ích mà sản phẩm của bạn mang lại không?', sender: 'user'},
        //     {
        //         text: 'Sản phẩm của chúng tôi có nhiều tính năng hữu ích như quản lý dự án, báo cáo và tích hợp với các công cụ khác.',
        //         sender: 'agent'
        //     },
        //     {text: 'Cảm ơn bạn! Mình thấy rất ấn tượng với tính năng quản lý dự án và khả năng báo cáo. Tuy nhiên, mình muốn biết rõ hơn về cách tích hợp với các công cụ khác, vì mình đang sử dụng nhiều ứng dụng để hỗ trợ công việc.', sender: 'user'},
        //     {
        //         text: 'Chúng tôi hỗ trợ tích hợp với các công cụ như Slack, Trello, và Google Drive để giúp bạn quản lý dự án hiệu quả hơn. Bạn cũng có thể kết nối với các hệ thống khác qua API của chúng tôi.',
        //         sender: 'agent'
        //     },
        //     {text: 'Nghe thật tuyệt vời! Việc tích hợp với Slack và Trello chắc chắn sẽ giúp mình rất nhiều trong việc duy trì liên lạc và theo dõi tiến độ dự án. Mình muốn bắt đầu dùng thử sản phẩm để có thể trải nghiệm những tính năng này một cách thực tế.', sender: 'user'},
        //     {
        //         text: 'Tuyệt vời! Để bắt đầu dùng thử, bạn chỉ cần đăng ký tài khoản trên trang web của chúng tôi và bạn sẽ nhận được hướng dẫn chi tiết. Ngoài ra, nếu bạn có bất kỳ câu hỏi nào trong quá trình sử dụng, đừng ngần ngại liên hệ với chúng tôi.',
        //         sender: 'agent'
        //     },
        //     {text: 'Cảm ơn bạn. Mình sẽ đăng ký ngay để bắt đầu trải nghiệm. Ngoài ra, có bất kỳ thông tin gì thêm mà mình cần chuẩn bị trước khi dùng thử không?', sender: 'user'},
        //     {
        //         text: 'Chúng tôi sẽ gửi bạn một email xác nhận và hướng dẫn cài đặt. Bạn cũng sẽ nhận được các mẹo sử dụng và thông tin cập nhật về sản phẩm. Nếu có bất kỳ vấn đề nào, hãy liên hệ với đội hỗ trợ của chúng tôi.',
        //         sender: 'agent'
        //     },
        //     {text: 'Cảm ơn rất nhiều! Mình sẽ kiểm tra email và theo dõi các hướng dẫn mà bạn gửi. Hy vọng sản phẩm sẽ mang lại những giá trị thiết thực cho công việc của mình. Cảm ơn bạn vì sự hỗ trợ tận tình!', sender: 'user'},
        //     {text: 'Bạn có câu hỏi nào khác không?', sender: 'agent'},
        //     {text: 'Hiện tại thì không có thêm câu hỏi nào nữa. Mình cảm thấy rất hài lòng với thông tin mà bạn đã cung cấp. Cảm ơn bạn đã giúp đỡ!', sender: 'user'},
        //     {
        //         text: 'Chúc bạn một ngày tốt lành và hy vọng sản phẩm của chúng tôi sẽ giúp ích cho công việc của bạn!',
        //         sender: 'agent'
        //     }
        // ];

        this._chatSessionService.getMessages(this.id).subscribe(
            (response) => {
                this.messages = response.data;
                console.log(this.messages);
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

    copyText(text: string): void {
        navigator.clipboard.writeText(text).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Sao chép thành công'});
        });
    }

    get isCollapse(){
        return this.shareService.isMobile.getValue() && this.shareService.isCollapsed.getValue()
    }

    sendMessage(message: string): void {
        // Logic để gửi tin nhắn

        // if (this.selectedGroupTopic === '' || this.selectedGroupTopic === null || this.selectedGroupTopic === undefined){

		// 	this.messageService.add({ severity: 'info', summary: 'Thông tin', detail: "Vui lòng chọn chủ đề."});
		// 	return;
		// }

		if (this.question === '' || this.question.length === 0) {
			return;
		}

		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		this.history = [];
		this.history = [...this.messages];
		this.messages.push({
			'text': this.question,
			'sender': 'user',
		});

		this.messages.push({
			'text': '',
			'sender': 'agent',
		});

		const tempQuestion = this.question;
		this.question = '';
		// this.loading = true;
		// this.readonly = true;
		// this.isUserAtBottom = true;
		this.scrollToBottom();

		if (this.id === undefined || this.id === null) {

			const chatSessionRequest = {
				'UserId': parseInt(this._storageService.get(StorageData.userId)),
				'SessionName': tempQuestion
			};

			this._chatBotService.CreateChatSession(chatSessionRequest).subscribe(
				(response) => {
					this.currentChatSession = response;
					const questionRequest = {
						SessionId: this.currentChatSession.id,
						Content: tempQuestion,
						sender: true
					};

					this._chatBotService.CreateQuestion(questionRequest).subscribe(
						(response) => {

							// this.loadMessages();
							this.requestAnswer(tempQuestion);
						},
						(error) => {
							console.error(error);
						}
					);
				},
				(err) => {
					console.error(err);
				}
			)
		} else {
			const questionRequest = {
				SessionId: parseInt(this.id),
				Content: tempQuestion,
				sender: true
			};
			this._chatBotService.CreateQuestion(questionRequest).subscribe((res) => {
				this.requestAnswer(tempQuestion);
			}, (err) => {
				console.error(err);
			});
		}


    }

    requestAnswer(_question: string) {

		const request = {
			"question": _question,
			"chat_history": this.history.map((item: any, index: number) => {
				return {
					"role": item.role === "user" ? "human" : "ai",
					"content": item.content || ""
				}
			}),
			"topic_id": this.selectedGroupTopic
		};

		var sendTime = Date.now();

		this._demoService.ask(request).subscribe((response: any) => {
			var returnTime = Date.now();
			const questionRequest = {
				SessionId: this.currentChatSession.id,
				Content: response.answer,
				sender: false,
				ResponseTime: returnTime - sendTime
			};
			this._chatBotService.CreateQuestion(questionRequest).subscribe((res) => {
                this.router.navigate(['/chat-bot', this.currentChatSession.id]);
			}, (err) => {
				console.error(err);
			});
			// let index = 0;
			// this.typeWriter(this.messages[this.messages.length - 1], response.answer, 1, index);
		}, (error) => {
			console.error(error);
			this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error });
		});
	}

    typeWriter(element: any, text: string, speed: number, index: number): void {
		if (index === text.length - 1) {
			this.readonly = false;
		}
		if (index < text.length) {
			element.content += text.charAt(index);
			index++;

			setTimeout(() => {
				this.typeWriter(element, text, speed, index);
			}, speed);
		}
	}

    receivedMessage(message: string): void {
        // Logic để xử lý tin nhắn nhận được từ welcome chat component
        console.log(`Nhận tin nhắn: ${message}`);
    }
}
