import {
    ApiProperty,
} from "@nestjs/swagger";


export class AuthToken {
    @ApiProperty()
    accessToken: string
};
