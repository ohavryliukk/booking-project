import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from 'src/entities/invitation.entity';
import { Repository } from 'typeorm';
import { InvitationDto } from './dto/invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
  ) {}

  async addInvitation(dto: InvitationDto): Promise<Invitation> {
    const newInvitation = await this.invitationRepository.save(dto);

    return newInvitation;
  }
}
