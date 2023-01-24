import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthStore } from "../services/auth.store";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authStore: AuthStore,
    private router: Router
  ) {}

  form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      email: ["test@angular-university.io", [Validators.required]],
      password: ["test", [Validators.required]],
    });
  }

  login() {
    const val = this.form.value;
    this.authStore
      .login(this.form.get("email").value, this.form.get("password").value)
      .subscribe(
        () => {
          this.router.navigateByUrl("/courses");
        },
        (err) => {
          alert("login failed");
        }
      );
  }
}
