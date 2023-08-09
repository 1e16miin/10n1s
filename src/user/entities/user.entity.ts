import {
	Column,
	Entity,
	Index
} from "typeorm";
import { Baseline } from "../../common/entities/baseline.entity";

@Entity("user")
export class UserEntity extends Baseline {
	@Index()
	@Column({ type: "varchar", length: 30, nullable: false, unique: true })
	email: string;

	@Column({ type: "char", length: 255 })
	hashedPassword: string;

	@Column({ type: "varchar", length: 10, nullable: false })
	name: string;

	@Column({ type: "varchar", length: 20, nullable: false })
	affiliation: string;

	@Column({ type: "varchar", length: 10, nullable: false })
	position: string;

	@Column({ type: "char", length: 12, nullable: false })
	contact: string;

	@Column({ type: "varchar", nullable: true })
	refreshToken?: string;
}
