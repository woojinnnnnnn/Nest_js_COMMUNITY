export class UserResponseDto {
      id: number;
      email: string;
      nickName: string;
      role: string;
    
      constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.nickName = user.nickName;
        this.role = user.role;
      }
    }