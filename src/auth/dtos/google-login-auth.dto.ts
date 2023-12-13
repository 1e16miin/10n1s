import {
    ApiProperty,
} from "@nestjs/swagger";

export class GoogleLoginInputDto {
    @ApiProperty()
    googleAccessToken: string
};
