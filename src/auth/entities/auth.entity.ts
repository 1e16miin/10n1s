import { Column, Entity, Index } from "typeorm";
import { Baseline } from "../../common/entities/baseline.entity";

@Entity("auth")
export class AuthEntity extends Baseline {
	@Index()
	@Column({ type: "varchar", length: 30 })
	email: string;

	@Column({ type: 'char', length: 6 })
	verifyCode: string;
}
