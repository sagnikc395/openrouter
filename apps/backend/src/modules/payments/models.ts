export namespace PaymentsModel {
  export interface OnrampSuccessResponse {
    message: "Successfully onramped !";
    credits: number;
  }

  export interface OnrampFailedResponse {
    message: "Onramp Failed!";
    credits: number;
  }
}
