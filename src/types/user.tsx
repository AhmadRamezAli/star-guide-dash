

export interface UserDto{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
}

export interface UserListDto{
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    birthDate?: string;
}


export interface UserCreateOrUpdateDto{
    id: string | null;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
}