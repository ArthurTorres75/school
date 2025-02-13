import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ParentsModule } from './parents/parents.module';
import { WorkersModule } from './workers/workers.module';
import { OccupationsModule } from './occupations/occupations.module';
import { ModulesModule } from './modules/modules.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AttendancesModule } from './attendances/attendances.module';
import { LapsesModule } from './lapses/lapses.module';
import { GradesModule } from './grades/grades.module';
import { ClassesModule } from './classes/classes.module';
import { LessonsModule } from './lessons/lessons.module';
import { ExamsModule } from './exams/exams.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ResultsModule } from './results/results.module';
import { EventsModule } from './events/events.module';
import { AnnouncementsModule } from './announcements/announcements.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UsersModule, AuthModule, StudentsModule, TeachersModule, ParentsModule, WorkersModule, OccupationsModule, ModulesModule, SubjectsModule, AttendancesModule, LapsesModule, GradesModule, ClassesModule, LessonsModule, ExamsModule, AssignmentsModule, ResultsModule, EventsModule, AnnouncementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
