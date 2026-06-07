import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { apiErrorCodes } from '../../common/errors/api-error-code';
import { AppException } from '../../common/errors/app.exception';
import { AppConfig } from '../../config/configuration';

export type StorageUploadInput = {
  bucket: string;
  key: string;
  buffer: Buffer;
  contentType: string;
};

export type StorageUploadResult = {
  url: string;
};

@Injectable()
export class SupabaseStorageService {
  private readonly client?: SupabaseClient;

  constructor(configService: ConfigService<AppConfig, true>) {
    const supabaseConfig = configService.get('supabase', { infer: true });

    if (supabaseConfig.url && supabaseConfig.serviceRoleKey) {
      this.client = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
  }

  async uploadPublicObject(input: StorageUploadInput): Promise<StorageUploadResult> {
    if (!this.client) {
      throw new AppException(
        apiErrorCodes.internalServerError,
        'Supabase Storage não está configurado.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { error } = await this.client.storage.from(input.bucket).upload(input.key, input.buffer, {
      contentType: input.contentType,
      upsert: false,
    });

    if (error) {
      throw new AppException(
        apiErrorCodes.internalServerError,
        'Não foi possível enviar o arquivo.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { data } = this.client.storage.from(input.bucket).getPublicUrl(input.key);

    return { url: data.publicUrl };
  }
}
