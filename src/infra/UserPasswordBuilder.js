import bcrypt from 'bcrypt';

export class UserPasswordBuilder {
    /**
     * 보안상의 이유로 사용자 비밀번호를 해싱합니다.
     */
    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * 평문 비밀번호와 저장된 bcrypt 해시를 비교합니다.
     */
    static comparePassword(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    }
}
