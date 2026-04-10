export namespace AuthModel {
  export interface SignupBody {
    email: string;
    password: string;
  }

  export interface SigninBody {
    email: string;
    password: string;
  }

  export interface SignupResponse {
    id: string;
  }

  export interface SigninResponse {
    message: "Signed in successfully";
  }

  export interface SigninFailureResponse {
    message: "Incorrect credentials";
  }

  export interface SignupFailedResponse {
    message: "Error while signing up";
  }
}
