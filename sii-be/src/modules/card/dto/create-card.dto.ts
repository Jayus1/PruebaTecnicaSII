import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    description: 'Número de la tarjeta de crédito',
    example: '1234567890123456',
  })
  @IsNotEmpty({ message: 'El número de tarjeta es requerido' })
  @IsString({ message: 'El número de tarjeta debe ser un texto' })
  @Matches(/^\d{16}$/, { message: 'El número de tarjeta debe tener 16 dígitos' })
  cardNumber: string;

  @ApiProperty({
    description: 'Nombre del titular de la tarjeta',
    example: 'Juan Pérez',
  })
  @IsNotEmpty({ message: 'El nombre del titular es requerido' })
  @IsString({ message: 'El nombre del titular debe ser un texto' })
  cardHolder: string;

  @ApiProperty({
    description: 'Fecha de expiración de la tarjeta (MM/YY)',
    example: '12/25',
  })
  @IsNotEmpty({ message: 'La fecha de expiración es requerida' })
  @IsString({ message: 'La fecha de expiración debe ser un texto' })
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'La fecha de expiración debe tener el formato MM/YY'
  })
  expiryDate: string;

  @ApiProperty({
    description: 'CVV de la tarjeta',
    example: '123',
  })
  @IsNotEmpty({ message: 'El CVV es requerido' })
  @IsString({ message: 'El CVV debe ser un texto' })
  @Matches(/^\d{3}$/, { message: 'El CVV debe tener 3 dígitos' })
  cvv: string;
}
