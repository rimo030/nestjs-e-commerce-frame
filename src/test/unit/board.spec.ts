// import { AppModule } from 'src/app.module';
// import { BoardsController } from 'src/controllers/boards.controller';
// import { BoardsService } from 'src/services/boards.service';
// import { Test } from '@nestjs/testing';

// describe('BoardController', () => {
//   let controller: BoardsController;
//   let service: BoardsService;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       imports: [AppModule],
//       controllers: [],
//       providers: [],
//     }).compile();

//     controller = module.get<BoardsController>(BoardsController);
//     service = module.get<BoardsService>(BoardsService);
//   });

//   it('controller, service is defined.', async () => {
//     expect(controller).toBeDefined();
//     expect(service).toBeDefined();
//   });

//   it('controller.getAllBoard는 배열을 리턴해야 한다.', async () => {
//     const response = controller.getAllBoard();

//     expect(response.length).toBeDefined();
//     expect(response instanceof Array).toBe(true);
//   });

//   describe('글 작성에 대한 테스트 진행', () => {
//     it('글을 작성한다면 이전에 작성된 글의 수보다 1개가 더 많아야 한다.', async () => {
//       const before = await controller.getAllBoard();

//       const beforeLength = before.length;

//       await controller.createBoard({
//         description: 'description',
//         title: 'title',
//       });

//       const after = await controller.getAllBoard();

//       expect(beforeLength + 1).toBe(after.length);
//     });

//     it.todo('방금 작성한 글은 유저가 작성한 글과 내용이 같아야 한다.');
//   });
// });
