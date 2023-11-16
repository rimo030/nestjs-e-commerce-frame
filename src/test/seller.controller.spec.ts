import { Test, TestingModule } from '@nestjs/testing';
import { SellerController } from '../controllers/seller.controller';
import { SellerService } from 'src/services/seller.service';
import { SellerEntity } from 'src/entities/seller.entity';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { AppModule } from 'src/app.module';

describe('SellerController', () => {
  let controller: SellerController;
  let service: SellerService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [],
      providers: [],
    }).compile();

    controller = module.get<SellerController>(SellerController);
    service = module.get<SellerService>(SellerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  /*
    판매자 등록 
  판매자는 email, 비밀번호, 이름, 핸드폰번호, 사업자 번호을 입력해야 회원가입 할 수 있다.
  판매자는 email과 비밀번호로 로그인된다.
  email은 중복되면 안된다.
  핸드폰, 사업자번호는 실제 있는 번호인지 검증이 필요

*/

  it('판매자는 email, 비밀번호, 이름, 핸드폰번호, 사업자 번호를 입력해야 회원가입 할 수 있다.', async () => {
    const response = await controller.createSeller();
    expect(response.email).toBe(String);
    expect(response.hashedPassword).toBe(String);
    expect(response.name).toBe(String);
    expect(response.phone).toBe(String);
    expect(response.businessNumber).toBe(String);
  });

  /*
    판매자 조회
  판매자는 자신의 email, 이름, 핸드폰번호, 사업자 번호를 열람 할 수 있어야 한다.
*/
  it('판매자는 자신의 email, 이름, 핸드폰번호, 사업자 번호를 열람 할 수 있어야 한다.', async () => {
    const response = await controller.getSeller();
    expect(response.email).toBe(String);
    expect(response.name).toBe(String);
    expect(response.phone).toBe(String);
    expect(response.businessNumber).toBe(String);
  });

  /*
    판매자 수정
  판매자는 이름, 핸드폰번호, 사업자 번호를 수정할 수 있어야 한다.
  판매자는  비밀번호를 갱신 할 수 있어야 한다.
  
  */

  it('판매자는 이름 || 핸드폰번호 || 사업자 번호를 수정할 수 있어야 한다.', async () => {
    const before = await controller.getSeller();

    await controller.updateSeller({
      name: 'test',
    });

    const after = await controller.getSeller();
    expect(before.updateAt < after.updateAt).toBe(true);
  });

  it('판매자는 비밀번호를 갱신 할 수 있어야 한다.', async () => {
    const response = await controller.updatePasswordSeller();
    expect(response.hashedPassword).toBe(String);
  });

  /*
    판매자 삭제
  판매자가 삭제되면? 판매자의 번들과 상품들이 모두 검색 불가처리
  이미 구매한 사람들에게는 -> 판매 중지 제품 페이지로 연결
  해당 id의 delete_at에 값이 들어가야한다.
*/
  it('해당 id의 delete_at에 값이 들어가야한다.', async () => {
    const response = await controller.deleteSeller();
    expect(response.deleteAt !== null).toBe(true);
  });
});
