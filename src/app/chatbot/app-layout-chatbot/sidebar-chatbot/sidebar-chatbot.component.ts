import { Component, EventEmitter, HostListener, OnInit, Output, Pipe } from '@angular/core';
import { ChatbotTheme, DataSideBarType } from "../../chatbot.enum.ts/chatbot.enum";
import { ChatbotService } from 'src/app/shared/services/chatbot.service';
import { TopicService } from 'src/app/services/topic.service';
import { ChatSessionService } from 'src/app/services/chatSession.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ShareService } from '../../service/share.service';
import { ChatBotService } from '../../service/chat-bot.service';

@Component({
    selector: 'app-sidebar-chatbot',
    templateUrl: './sidebar-chatbot.component.html',
    styleUrls: ['./sidebar-chatbot.component.scss']
})
export class SidebarChatbotComponent implements OnInit {
    visible = false
    ChatbotTheme = ChatbotTheme;
    selectedChatSession: number = -1;
    dropdownTopics: any[] = [];
    chatSessions: any[] = [];
    constructor(
        private _chatBotService: ChatbotService,
        private readonly _topicService: TopicService,
        private readonly _chatSessionService: ChatSessionService,
        private readonly _authService: AuthService,
        private readonly router: Router,
        private shareService:ShareService,
        private chatBotService: ChatBotService,
    ) {
    }

    onButtonClick() {
        this.toggleSidebarMobileEvent.emit(false);
    }
    choosenData:any
    isClosed = false;
    data: any = [
        {
            type: DataSideBarType.pin,
            label: 'Đã ghim',
            isShowMore: false,
            data: [
                // {id: 1, no: 1, name: 'Hợp đồng lao động được xác lập', active: false},
            ],
            dataShow: []
        },
        {
            type: DataSideBarType.lastest,
            label: 'Gần đây',
            isShowMore: false,
            data: [

            ],
            dataShow: []
        }
    ]


    @Output() toggleSidebarEvent = new EventEmitter<boolean>();
    @Output() toggleSidebarMobileEvent = new EventEmitter<boolean>();

    toggleSidebar() {
        this.isClosed = !this.isClosed;
        this.toggleSidebarEvent.emit(this.isClosed);
        this.shareService.isCollapsed.next(this.isClosed)
    }

    exportDocx(id: number, name: string) {
        this._chatSessionService.exportDocx(id).subscribe((response: any) => {
            let fileName = 'Chat_' + id + '.docx';
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

    logOut(){
        this._authService.logout();
        this.router.navigate(['/auth/login']);
    }

    deleteChatSession() {
        this._chatSessionService.deleteChatSession(this.selectedChatSession).subscribe(
            (response) => {
                this.getChatSessions();
                this.cancel();
            },
            (error) => {
                console.error(error);
            }
        );
    }

    confirm(id: number) {
        this.visible = true;
        this.selectedChatSession = id;
    }

    cancel() {
        this.visible = false;
        this.selectedChatSession = -1;
    }

    storageChatSession(id: number) {
        const request = {
            Id: id,
            Storage: true
        }
        this._chatSessionService.storageChatSession(id, request).subscribe(
            (response) => {
                this.getChatSessions();
            },
            (error) => {
                console.error(error);
            }
        );
    }

    chooseItem(no: any, id: number) {
        this.data.forEach((data: any) => {
            for (const item of data.dataShow) {
                item.active = item.no == no;
            }
        });
        this.chatBotService.sendData(id);

        this._chatSessionService.getMessages(id).subscribe(
            (response) => {

            },
            (error) => {
                console.error(error);
            }
        );

    }

    pin(id: number) {
        const request = {
            Id: id,
            pin: true
        }

        this._chatSessionService.updateChatSession(id, request).subscribe(
            (response) => {
                this.getChatSessions();
            },
            (error) => {
                console.error(error);
            }
        );

    }

    unPin(id: number) {
        const request = {
            Id: id,
            pin: false
        }

        this._chatSessionService.updateChatSession(id, request).subscribe(
            (response) => {
                this.getChatSessions();
            },
            (error) => {
                console.error(error);
            }
        );
    }

    isData0Complete: boolean = false;
    isData1Complete: boolean = false;

    showMorePin(type: DataSideBarType) {
    const maxToShow = 5;
    let currentData: any;
        switch (type) {
            case DataSideBarType.pin:
                this.data[0].isShowMore = !this.data[0].isShowMore
                this.data[0].dataShow = this.data[0].isShowMore ? this.data[0].data : this.data[0].data.slice(0, 5)
                break
            default:
                this.data[1].isShowMore = !this.data[1].isShowMore
                this.data[1].dataShow = this.data[1].isShowMore ? this.data[1].data : this.data[1].data.slice(0, 5)
                break
        }

        const currentLength = currentData.dataShow.length;
        const remainingData = currentData.data.length - currentLength;

        if (remainingData > 0) {
            const nextItems = currentData.data.slice(currentLength, currentLength + maxToShow);
            currentData.dataShow = currentData.dataShow.concat(nextItems);
        } else {
            if (type === DataSideBarType.pin) {
                this.isData0Complete = true;
            } else {
                this.isData1Complete = true;
            }
            console.log(`Đã hiển thị hết dữ liệu cho ${type === DataSideBarType.pin ? 'data[0]' : 'data[1]'}.`);
        }
    }


    checkShow(index: any) {
        return this.data[index].data.length == this.data[index].dataShow.length
    }


    ngOnInit(): void {
        this.getChatSessions();
        this.getDropdownTopics();
    }

    get checkDisableAddNew(){
        return this.router.url == '/chat-bot'
    }

    linkToNew() {
        this.router.navigate(["/chat-bot"])
        this.data.forEach((section:any) => {
            section.data.forEach((item:any) => {
                item.active = false;
            });
            section.dataShow.forEach((item:any) => {
                item.active = false;
            });
        });
    }

    getChatSessions() {
        this._chatSessionService.getHistory().subscribe(
            (response) => {
                this.chatSessions = response;
                console.log(this.chatSessions);
                this.data[0].data = this.chatSessions.filter(p => p.pin === true).map((p) => {
                    return { ...p, active: false, no: this.chatSessions.indexOf(p) + 1, pin: true }
                });

                this.data[1].data = this.chatSessions.filter(p => p.pin === false).map((p) => {
                    return { ...p, active: false, no: this.chatSessions.indexOf(p) + 1, pin: false }
                });

                this.data.forEach((item: any) => {
                    item.dataShow = item.data.slice(0, 5)
                })
            },
            (error) => {
                console.error(error);
            }
        );
    }

    getDropdownTopics() {
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

    chooseData(data:any){
        this.choosenData = data
        console.log(data)
    }

    delete(){
            // Xóa từ data
            this.data.forEach((section:any) => {
                section.data = section.data.filter((item:any) => item.id !== this.choosenData.id);
                section.dataShow = section.dataShow.filter((item:any) => item.id !== this.choosenData.id);
            });
    }

    get theme(){
        return this.shareService.theme.getValue() == ChatbotTheme.light
    }

}
