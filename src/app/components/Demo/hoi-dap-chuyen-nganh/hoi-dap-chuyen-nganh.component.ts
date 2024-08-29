import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { DemoService } from 'src/app/services/demo.service';
import { GroupTopicService } from 'src/app/services/groupTopic.service';
import { TopicService } from 'src/app/services/topic.service';
import { StorageData } from 'src/app/shared/constants/app.constants';
import { ChatbotService } from 'src/app/shared/services/chatbot.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
	selector: 'app-hoi-dap-chuyen-nganh',
	templateUrl: './hoi-dap-chuyen-nganh.component.html',
	styleUrls: ['./hoi-dap-chuyen-nganh.component.scss']
})
export class HoiDapChuyenNganhComponent {
	@ViewChild('messagesContainer', { static: false }) private messagesContainer!: ElementRef;
	searchTxt: string = '';
	result: any;
	messages: any;
	chatSessions: any[] = [];
	currentChatSession: any = null;
	selectedGroupTopic: any = '';
	dropdownTopics: any;
	items: any;
	dropdownFoucs: boolean = false;
	public loading: boolean = true;
	public readonly: boolean = false;
	public sendMessage: string = '';
	public history: any = [];
	
	private isUserAtBottom: boolean = true;
	constructor(
		private http: HttpClient,
		private _chatBotService: ChatbotService,
		private _storageService: StorageService,
		private readonly _groupTopicService: GroupTopicService,
		private messageService: MessageService,
		private readonly _topicService: TopicService,
		private readonly _demoService: DemoService
	) {
		this.result = {};
		this.messages = [];
	}

	ngOnInit(): void {
		this.items = [
            {
                icon: 'pi pi-pencil',
                command: () => {
                    this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
                }
            },
            {
                icon: 'pi pi-refresh',
                command: () => {
                    this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
                }
            },
            {
                icon: 'pi pi-trash',
                command: () => {
                    this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
                }
            },
            {
                icon: 'pi pi-upload',
                routerLink: ['/fileupload']
            },
            {
                icon: 'pi pi-external-link',
                target: '_blank',
                url: 'http://angular.io'
            }
        ];

		this.getChatSessions();
		this.getDropdownTopics();
	}

	getDropdownTopics(){
		const request = {};
		this._topicService.getTopicByPaing(request).subscribe((res: any) => {
			if (res.meta.status_code === 200) {
			  this.dropdownTopics = res.data.map((item: any) => {
				return {
					'id': item.id,
					'name': item.name,
					'code': item.code
				}
			  });

			} else {
			  console.log(res.meta.status_message);
			}
		  });
	}
	

	disabledSendButton(){
		if (this.selectedGroupTopic === '' || this.selectedGroupTopic.length === 0 || this.selectedGroupTopic === null || this.selectedGroupTopic === undefined)
			return true;

		if (this.loading)
			return true;

		if (this.sendMessage.trim().length === 0)
			return true;

		return false;
	}

	sendMessages() {

		// if (this.selectedGroupTopic === '' || this.selectedGroupTopic.length === 0 || this.selectedGroupTopic === null || this.selectedGroupTopic === undefined){
		// 	this.dropdownFoucs = true;
		// 	this.messageService.add({ severity: 'info', summary: 'Thông tin', detail: "Vui lòng chọn chủ đề."});
		// 	return;
		// }

		if (this.sendMessage === '' || this.sendMessage.length === 0) {
			return;
		}
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		this.history = [];
		this.history = [...this.messages];
		console.log(this.history);
		this.messages.push({
			'content': this.sendMessage,
			'role': 'human',
		});

		this.messages.push({
			'content': '',
			'role': 'ai',
			'name': 'Meow'
		});

		const tempQuestion = this.sendMessage;
		this.sendMessage = '';
		this.loading = true;
		this.readonly = true;
		this.isUserAtBottom = true;
		this.scrollToBottom();

		if (this.currentChatSession === undefined || this.currentChatSession === null) {

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
							this.getChatSessions();
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
				SessionId: this.currentChatSession.id,
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
					"role": item.role,
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

			}, (err) => {
				console.error(err);
			});
			let index = 0;
			this.typeWriter(this.messages[this.messages.length - 1], response.answer, 1, index);
		}, (error) => {
			console.error(error);
			this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error });
		});
	}

	newSession() {
		this.currentChatSession = null;
		this.messages = [];
	}

	getChatSessionDetail(session: any) {
		this.currentChatSession = session;
		this._chatBotService.getChatSessionDetail(session.id).subscribe((response) => {
			this.messages = response;
			this.isUserAtBottom = true;
			this.scrollToBottom();
		}, (error) => {
			console.error(error);
		});
	}

	getChatSessions() {
		this._chatBotService.getUserSesions().subscribe(
			(response) => {
				this.chatSessions = response;
			},
			(error) => {
				console.error(error);
			}
		);
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


	ngAfterViewChecked(): void {
		this.scrollToBottom();
	}

	scrollToBottom() {
		if (this.isUserAtBottom) {
			this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
		}
	}

	ngAfterViewInit() {
		this.messagesContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
	}

	onScroll(event: Event) {
		const element = this.messagesContainer.nativeElement as HTMLElement;
		this.isUserAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
	}

}
