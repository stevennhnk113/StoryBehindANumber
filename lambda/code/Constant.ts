export const NumberSlot = "Number";

export enum CRUDResult
{
	Success = "Success",
	Failed = "Failed",
	Exist = "Exist",
	NotExist = "Not Exist"
}

export enum Handler
{
	LaunchRequestHandler = "LaunchRequestHandler",
	GetNumberStoryIntentHandler = "GetNumberStoryIntentHandler",
	GoodByeIntentHandler = "GoodByeIntentHandler"
}