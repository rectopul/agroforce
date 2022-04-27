import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';

export interface HandleImgUpload {
  getImg: () => string;
  reset: () => void;
}

export const HandleImgUpload = forwardRef<HandleImgUpload, { avatar?: string }>(
  ({ avatar }, ref) => {
    console.log('COMPONENTE ' + avatar);
    const [img, setImg] = useState<any>(null);

    useEffect(() => {
      if (avatar) setImg(avatar);
    }, [avatar]);

    const getImg = () => img;
    const reset = () => setImg(null);

    useImperativeHandle(ref, () => ({
      getImg,
      reset,
    }));

    const onChange = ({ target }: any) => {
      const file = target.files[0];

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = e.target.result;

        setImg(data);
      };

      reader.readAsDataURL(file);
    };

    return (
      <label htmlFor="upload-file">
        <input
          style={{ display: 'none' }}
          id="upload-file"
          type="file"
          name="file"
          accept='image/*'
          multiple={false}
          onChange={onChange}
        />
        <img
          src={img || <AiOutlineCamera />}
          alt="upload de foto"
          style={img ? { objectFit: 'cover', borderRadius: '50%' } : {}}
        />
      </label>
    );
  }
)
