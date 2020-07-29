import { Component, OnInit,HostListener, Input,Output,EventEmitter ,ViewChild,ElementRef} from '@angular/core';
import { Observable } from 'rxjs';
import {DataService} from '../../shared/service/data.service'
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup,FormControl, Validators  } from '@angular/forms';
import { APP_CONST } from '@app/app.constant';
import { slideOutAnimation, fadeInAnimation } from  'assets/animations/animations';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
    animations: [
        slideOutAnimation,
        fadeInAnimation
    ]
})
export class QuestionComponent implements OnInit { 
  @Output() _overlayClosed = new EventEmitter<object>(); 
  public isShowOverlay: boolean = false;
    userInfo :any; ;
   
  answer: string;  
  isDelay:boolean=false;
  formGroup: FormGroup;
  question: any;
  totalQuestions: number;
  completionTime: number;
  correctAnswersCount = 0;
  
  topicName :string;
  quizname:string;
  questionID = 0;
  currentQuestion = 0;
  questionIndex: number;
  correctAnswer: boolean;
  hasAnswer: boolean;
  disabled: boolean;
  quizIsOver: boolean;
  progressValue: number;
  timeLeft: number;
  timePerQuestion = 60;
  interval: any;
  elapsedTime: number;
  elapsedTimes = [];
  blueBorder = '2px solid #007aff';
  allQuestions:any=[];
  allQuestions1: any = [
    {
      questionId: 1,
      questionText: 'What is the objective of dependency injection?',
      options: ['Pass the service to the client.', 
      'Allow the client to find service.',
      'Allow the client to build service.' ,
      'Give the client part service.' 
      ],
      answer: 'Pass the service to the client.',
      explanation: 'a service gets passed to the client during DI',
      selectedOption: ''
    },
    {
      questionId: 2,
      questionText: 'Which of the following benefit from sql injection?',
      options: ['Programming','Testability','Software design','All of the above.'],
      answer: 'All of the above.',
      explanation: 'DI simplifies both programming and testing as well as being a popular design pattern',
      selectedOption: ''
    },
    {
      questionId: 3,
      questionText: 'Which of the following is the first step in setting up dependency injection?',
      options: ['Require in the component.',
      'Provide in the module.',
      'Mark dependency as @Injectable().',
      'Declare an object.' 
      ],
      answer: 'Mark dependency as @Injectable().',
      explanation: 'the first step is marking the class as @Injectable()',
      selectedOption: ''
    },
    {
      questionId: 4,
      questionText: 'In which of the following does dependency injection occur?',
      options: ['@Injectable()',
      'constructor' ,
       'function' ,
        'NgModule' ,
      ],
      answer: 'constructor',
      explanation: 'object instantiations are taken care of by the constructor in Angular',
      selectedOption: ''
    }
  ];  
  option = '';
  grayBorder = '2px solid #979797';
  
    constructor(
      private dataService:DataService,      
      private location: Location,private activeroute: ActivatedRoute,private router :Router
    ) {
      
    this.activeroute.paramMap.subscribe(params => {
      this.setQuestionID(+params.get('questionId'));  // get the question ID and store it
       this.topicName = params.get('topicname');
       this.quizname = params.get('quizname')
    });
     }
  
    ngOnInit() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.getQuestion(); 
      this.buildForm();     
    
    }
    
    ngAfterViewChecked() {        
   
  } 

  buildForm() {
    this.formGroup = new FormGroup({
      answer: new FormControl(['', Validators.required])
    });
  }
    public navigateToBack() {
      clearTimeout(this.interval);
      this.closeOverlay(true, true);
      this.location.back();
    }
    public closeOverlay(value: boolean, isContactSave?: boolean) {
      this._overlayClosed.emit({ value, isContactSave });
      this.isShowOverlay = !value;
    }

    displayNextQuestion() {
    //  this.resetTimer();
      this.increaseProgressValue();
  
      this.questionIndex = this.questionID++;
  
      if (typeof document.getElementById('question') !== 'undefined' && this.getQuestionID() <= this.totalQuestions) {
        document.getElementById('question').style.border = this.blueBorder;
        this.question= this.allQuestions[this.questionID-1];
      } else {
        clearTimeout(this.interval);
        this.navigateToResults();
      }
    }
  
    navigateToNextQuestion(): void {
      this.router.navigate(['/question/'+ this.topicName +'/'+ this.quizname +'/', this.getQuestionID() + 1]);
      this.displayNextQuestion();
    }
     navigateToPreviousQuestion(): void {
    this.router.navigate(['/question/'+ this.topicName +'/'+ this.quizname +'/', this.getQuestionID() - 1]);
    this.displayPreviousQuestion();
  } 
  
  displayPreviousQuestion() {
  //  this.resetTimer();
    this.decreaseProgressValue();

    this.questionIndex = this.questionID--;

    if (typeof document.getElementById('question') !== 'undefined' && this.getQuestionID() <= this.totalQuestions) {
      document.getElementById('question').style.border = this.blueBorder;
      this.question= this.allQuestions[this.questionID-1] 
    } else {
      clearTimeout(this.interval);
      this.navigateToResults();
    }
  } 

    decreaseProgressValue() {
    this.progressValue = parseFloat((100 * (this.getQuestionID() - 1) / this.totalQuestions).toFixed(1));
  } 
    navigateToResults(): void {
      this.completionTime = 60 - this.timeLeft;
      this.router.navigate(['/result'], { state:
        {
          topicname : this.topicName,
          totalQuestions: this.totalQuestions,
          correctAnswersCount: this.correctAnswersCount,
          completionTime: this.completionTime,
          allQuestions: this.allQuestions
        }
      });
    }
  
    checkIfAnsweredCorrectly() {
      if (this.isCorrectAnswer()) {
        this.incrementCorrectAnswersCount();
        this.correctAnswer = true;
        this.hasAnswer = true;
        this.disabled = false;
  
        this.elapsedTime = Math.ceil(this.timePerQuestion - this.timeLeft);
        if (this.getQuestionID() < this.totalQuestions) {
          this.elapsedTimes = [...this.elapsedTimes, this.elapsedTime];
        } else {
          this.elapsedTimes = [...this.elapsedTimes, 0];
          this.completionTime = this.calculateTotalElapsedTime(this.elapsedTimes);
        }
  
        this.quizDelay(3000);
  
        if (this.getQuestionID() < this.totalQuestions) {
          this.navigateToNextQuestion();
        } else {
          clearTimeout(this.interval);
         // this.navigateToResults();
        }
      }
    }
  
    incrementCorrectAnswersCount() {
      if (this.questionID <= this.totalQuestions && this.isCorrectAnswer()) {
        if (this.correctAnswersCount === this.totalQuestions) {
          return this.correctAnswersCount;
        } else {
          this.correctAnswer = true;
          this.hasAnswer = true;
          return this.correctAnswersCount++;
        }
      } else {
        this.correctAnswer = false;
        this.hasAnswer = false;
      }
    }
  
    increaseProgressValue() {
      this.progressValue = parseFloat((100 * (this.getQuestionID() + 1) / this.totalQuestions).toFixed(1));
    }
  
    calculateTotalElapsedTime(elapsedTimes) {
      return this.completionTime = elapsedTimes.reduce((acc, cur) => acc + cur, 0);
    }
    getQuestionID() {
      return this.questionID;
    }
  
    setQuestionID(id: number) {
      return this.questionID = id;
    }
  
    isThereAnotherQuestion(): boolean {
      return this.questionID < this.allQuestions.length;
    }
  
    isFinalQuestion(): boolean {
      return this.questionID === this.totalQuestions;
    }
  
    isCorrectAnswer(): boolean {
      return this.question.selectedOption === this.question.answer;
    }
  
    getQuestion() {
      this.dataService.getQuizName(this.topicName,this.quizname).subscribe(data => {
        this.allQuestions = data;
        if(this.allQuestions.length>0){
          this.question= this.allQuestions[this.questionID-1];
        this.totalQuestions = this.allQuestions.length;
        this.timeLeft = this.timePerQuestion;
        this.progressValue = 100 * (this.questionID) / this.totalQuestions; 
        this.countdown();
        }
       });     
    }
  
    // countdown clock
    private countdown() {   
      if (this.questionID <= this.totalQuestions) {
        this.interval = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;  
            this.checkIfAnsweredCorrectly(); 
  
            if (this.correctAnswersCount <= this.totalQuestions) {
              this.calculateTotalElapsedTime(this.elapsedTimes);
            }
            if (this.timeLeft === 0 && !this.isFinalQuestion()) {
              clearTimeout(this.interval);
              this.navigateToResults();
            }
            if (this.timeLeft === 0 && this.isFinalQuestion()) {
              clearTimeout(this.interval);
              this.navigateToResults();
            }
            if (this.isFinalQuestion() && this.hasAnswer === true) {
              // clearTimeout(this.interval);
            //  this.navigateToResults();
              this.quizIsOver = true;
            }
  
            // disable the next button until an option has been selected
            this.question.selectedOption === '' ? this.disabled = true : this.disabled = false;
          }
        }, 1000);
      }
    }
  
    private resetTimer() {
      this.timeLeft = this.timePerQuestion;
    }
  
    quizDelay(milliseconds) { 
      const start = new Date().getTime();
      let counter = 0;
      let end = 0;
  
      while (counter < milliseconds) { 
        end = new Date().getTime();
        counter = end - start;
      }
    }

    radioChange(answer: string) {
      this.question.selectedOption = answer;
      if(this.isCorrect(answer)){
      //  this.correctAnswersCount++;
      }
    }
  
    displayExplanation(): void {
      const questionElem = document.getElementById('question');
      if (questionElem !== null) {
        questionElem.innerHTML = 'Option ' + this.question.answer + ' was correct.';
        questionElem.style.border = this.grayBorder;
      }
    }
  
    // mark the correct answer regardless of which option is selected once answered
    isCorrect(option: string): boolean {
      return this.question.selectedOption && option === this.question.answer;
    }
  
    // mark incorrect answer if selected
    isIncorrect(option: string): boolean {
      return option !== this.question.answer && option === this.question.selectedOption;
    }
  
    onSubmit() {
      this.formGroup.reset({answer: null});
    }
    
  
    ngOnDestroy() { } 
    
  }
  
