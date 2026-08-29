export interface ForcastorDto {
  id: string;
  name: string;
  imagePath: string;
  description: string;
  rate: number | null;
}

export interface ForcastorCreateOrUpdateDto {
id: string | null;
name: string;
imageFile?: File | null;
description: string;
rate: number | null;

}

export interface ForcastorListDto {
  id: string;
  name: string;
  imagePath: string;
  description: string;
  rate: number | null;
}