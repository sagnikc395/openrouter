export namespace AuthModel {
  export interface SigninSchema {
    email: string;
    password: string;
  }

  export interface SigninResponse {
    message: "Signed in successfully";
  }

  export interface SigninFailure {
    message: "Incorrect credentials";
  }

  export interface SignupSchema {
    email: string;
    password: string;
  }

  export interface SignupResponse {
    id: string;
  }

  export interface SignupFailedResponse {
    message: "Error while signing up";
  }

  export interface ProfileResponse {
    credits: number;
  }

  export interface ProfileResponseError {
    message: "Error while fetching user details";
  }
}
