import config from '@/config';
import EmailSequenceJob from '@/jobs/emailSequence';
import Agenda from 'agenda';

export default ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'send-email',
    {
      priority: 'high', // Raw string literal here
      concurrency: config.agenda.concurrency 
    } as any, // Cast as 'any' to bypass type checking temporarily
    new EmailSequenceJob().handler,
  );

  agenda.start();
};
