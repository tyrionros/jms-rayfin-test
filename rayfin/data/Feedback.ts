import {
  entity,
  role,
  text,
  int,
  date,
  uuid,
} from '@microsoft/rayfin-core';

@entity()
@role('authenticated', '*', {
  policy: (claims, item) => claims.sub.eq(item.user_id),
})
export class Feedback {
  @uuid() id!: string;
  @text() user_id!: string;
  @text() user_email!: string;
  @text({ min: 1, max: 100 }) subject!: string;
  @text({ max: 2000 }) message!: string;
  @int({ min: 1, max: 5 }) rating!: number;
  @date() createdAt!: Date;
}
