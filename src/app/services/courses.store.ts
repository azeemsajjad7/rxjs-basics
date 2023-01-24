import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({ providedIn: "root" })
export class CoursesStore {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messageService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((err) => {
        this.messageService.showErrors("Could not load courses");
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    const index = courses.findIndex((course) => course.id == courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;
    this.subject.next(newCourses);

    return this.http.put("/api/courses/" + courseId, changes).pipe(
      catchError((err) => {
        this.messageService.showErrors("Could not save course");
        return throwError(err);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((res) =>
        res.filter((ele) => ele.category == category).sort(sortCoursesBySeqNo)
      )
    );
  }
}
