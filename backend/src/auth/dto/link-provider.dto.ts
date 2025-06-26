import { IsString } from "class-validator";

export class LinkAccountDto {
    @IsString()
    provider: string;

    @IsString()
    providerId: string;
}