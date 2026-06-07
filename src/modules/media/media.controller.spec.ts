import { MediaController } from './media.controller';
import { UploadedImageFile } from './media.types';

const authUser = {
  supabaseAuthId: '7af9f040-922b-4a6f-97d8-f39cc338c29d',
  email: 'artur@example.com',
};

const imageFile: UploadedImageFile = {
  originalname: 'luke.jpg',
  mimetype: 'image/jpeg',
  size: 1024,
  buffer: Buffer.from('image'),
};

describe('MediaController', () => {
  it('uploads media item response', async () => {
    const media = { id: 'media-id', postId: 'post-id', dogId: 'dog-id' };
    const mediaService = {
      upload: jest.fn().mockResolvedValue(media),
    };
    const controller = new MediaController(mediaService as never);
    const body = { postId: 'post-id' };

    await expect(controller.upload(authUser, body, imageFile)).resolves.toEqual({ data: media });

    expect(mediaService.upload).toHaveBeenCalledWith(authUser, body, imageFile);
  });
});
