import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONST } from '@app/app.constant';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  materData: any;

  constructor(private http: HttpClient) {
  }  

  //Auth
  register(object) {
    return this.http.post(APP_CONST.API_URL + '/members', object);
  }
  updateMember(object,id) {
    return this.http.put(APP_CONST.API_URL + '/members/'+id, object);
  }
  getMember(userName:string) {    
    return this.http.get(APP_CONST.API_URL + '/members?filter={"where":{"userName":"'+userName+'"}}')
  }
  getDuplicateMail(email:string) {    
    return this.http.get(APP_CONST.API_URL + '/members?filter={"where":{"email":"'+email+'"}}')
  }
  //timesheet
  getSwipeIn(userName:string,today:string) {    
    return this.http.get(APP_CONST.API_URL + '/timesheets?filter={"where":{"today":"'+today+'","username":"'+userName+'"}}')
  }
  getTimeSheet(userName) {    
    return this.http.get(APP_CONST.API_URL + '/timesheets?filter={"where":{"username":"'+userName+'"}}')
  }
  swipeIn(object) {
    return this.http.post(APP_CONST.API_URL + '/timesheets', object);
  }

  swipeOut(object){
    return this.http.patch(APP_CONST.API_URL + '/timesheets', object);
  }
  //Discussion
  getTeacher(topic:string) {    
    return this.http.get(APP_CONST.API_URL + '/members?filter={"where":{"subject":"'+topic+'"}}')
  }
  getEveryone() {    
    return this.http.get(APP_CONST.API_URL + '/members')
  }
  getDiscussion() {    
    return this.http.get(APP_CONST.API_URL + '/discussions')
  }
  getDiscussionById(id) {    
    return this.http.get(APP_CONST.API_URL + '/discussions?filter={"where":{ "id": '+id+'}}')
  }
  getMyDiscussion(askedBy:string) {    
    return this.http.get(APP_CONST.API_URL + '/discussions?filter={"where":{"askedBy":"'+askedBy+'"}}')
  }
  deleteDiscussion(id) {
    return this.http.delete(APP_CONST.API_URL + '/discussions/'+ id);
  }
  getComments(id:number) {    
    return this.http.get(APP_CONST.API_URL + '/comments?filter={"where":{ "questionid": '+id+'}}')
  }
  getLikedPost(id:number,userName:string) {    
    return this.http.get(APP_CONST.API_URL + '/likes?filter={"where":{ "questionid": '+id+',"userName":"'+userName+'"}}')
  }
  createDiscussion(object) {
    return this.http.post(APP_CONST.API_URL + '/discussions', object);
  }
  addComment(object) {
    return this.http.post(APP_CONST.API_URL + '/comments', object);
  }
  likePost(object) {
    return this.http.post(APP_CONST.API_URL + '/likes', object);
  }
  updatedPost(object){
    return this.http.patch(APP_CONST.API_URL + '/discussions', object);
  }

  //file
  getFiles() {    
    return this.http.get(APP_CONST.API_URL + '/filesections')
  }
  createFile(object) {
    return this.http.post(APP_CONST.API_URL + '/filesections', object);
  }
  addFileComment(object) {
    return this.http.post(APP_CONST.API_URL + '/filecomments', object);
  }
  getFileComments(id:number) {    
    return this.http.get(APP_CONST.API_URL + '/filecomments?filter={"where":{ "fileid": '+id+'}}')
  }                                                                     
  deleteFile(id) {
    return this.http.delete(APP_CONST.API_URL + '/filesections/'+ id);
  }
 

  //chat
  getChatSeasionId() {    
    return this.http.get(APP_CONST.WATSON_URL + '/session')
  }
  getBotMsg(object) {
    return this.http.post(APP_CONST.WATSON_URL + '/message', object);
  }
  fetchToken(): Observable<string> {
    return this.http.get(APP_CONST.WATSON_URL + '/speech-to-text/token', { responseType: 'text' });
  }
//translator
  getLang() {    
    return this.http.get(APP_CONST.WATSON_URL +'/identifiable_languages');
  }
  getModels(){
  return this.http.get(APP_CONST.WATSON_URL +'/models');
  }

  detectedlang(body) {    
    return this.http.post(APP_CONST.WATSON_URL +'/identify',body);
  }
  translate(body) {    
    return this.http.post(APP_CONST.WATSON_URL +'/translate',body);
  }

  //Quiz
  getQuiz() {    
    return this.http.get(APP_CONST.API_URL + '/quizes')
  }
  getAllQuestion(topicName:string) {    
    return this.http.get(APP_CONST.API_URL + '/questions?filter={"where":{ "topicname": "'+topicName+'"}}');
  }
  createQuiz(obj){
    return this.http.post(APP_CONST.API_URL + '/questions', obj);
  }
  getQuizName(topicName:string,quizName) {    
    return this.http.get(APP_CONST.API_URL + '/questions?filter={"where":{ "topicname": "'+topicName+'","quizname":"'+quizName+'"}}')
  }
  postResult(obj){
    return this.http.post(APP_CONST.API_URL + '/results', obj);
  }
  getProfileData(userName) {    
    return this.http.get(APP_CONST.API_URL + '/results?filter={"where":{"username":"'+userName+'"}}')
  }
  getStudentData(userName) {    
    return this.http.get(APP_CONST.API_URL + '/results?filter={"where":{"createdby":"'+userName+'"}}')
  }
  //inbox
  send(object) {
    return this.http.post(APP_CONST.API_URL + '/inboxs', object);
  }
  getInbox(userName){
    return this.http.get(APP_CONST.API_URL + '/inboxs?filter={"where":{"tousername":"'+userName+'"}}')
  }

  //noty
  postNoty(object) {
    return this.http.post(APP_CONST.API_URL + '/notys', object);
  }
  getNoty(userName){
    return this.http.get(APP_CONST.API_URL + '/notys?filter={"where":{"tousername":"'+userName+'"}}')
  }
}
