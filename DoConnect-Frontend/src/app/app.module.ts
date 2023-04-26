import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './components/chat/chat.component';
import { AnswerComponent } from './components/answer/answer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreateQuestionComponent } from './components/create-question/create-question.component';
import { SearchComponent } from './search/search.component';
import { PendingQuestionComponent } from './components/pending-question/pending-question.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    ChatComponent,
    AnswerComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    CreateQuestionComponent,
    SearchComponent,
    PendingQuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
