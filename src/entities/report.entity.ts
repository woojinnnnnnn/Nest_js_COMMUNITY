import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum reportTag {
      COMMUNITY = 'COMMUNITY',
      USER = 'USER',
      COMMENT = 'COMMENT'
}

@Entity('REPORT')
export class Report {
      @PrimaryGeneratedColumn({ type: 'int' })
      id: number

      @IsNotEmpty()
      @IsString()
      @Column({ type: 'varchar' })
      reason: string

      @Column({ type: 'varchar' })
      tags: reportTag 

      @Column({ type: 'int' })
      tagsId: number

}

// api 구현 하면서 함 봐야 할듯.