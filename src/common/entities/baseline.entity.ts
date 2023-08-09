import {
	BaseEntity,
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export abstract class Baseline extends BaseEntity {
	@PrimaryGeneratedColumn({ unsigned: true })
	id: number;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;

	@DeleteDateColumn({ type: "timestamp", select: false })
	deletedAt: Date;
}
