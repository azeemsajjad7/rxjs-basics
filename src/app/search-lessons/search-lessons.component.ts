import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./search-lessons.component.html",
  styleUrls: ["./search-lessons.component.css"],
})
export class SearchLessonsComponent implements OnInit {
  constructor(private courseService: CoursesService) {}

  searchResults$: Observable<Lesson[]>;
  activeLesson: Lesson;

  ngOnInit() {}

  search(val: string) {
    this.searchResults$ = this.courseService.searchLessons(val);
  }

  openLesson(ele: Lesson) {
    this.activeLesson = ele;
  }

  back() {
    this.activeLesson = null;
  }
}
