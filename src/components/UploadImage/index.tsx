import { HiOutlinePhoto } from 'react-icons/hi2';
import { Card } from 'konsta/react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CustomButton } from '../Button';
import { useCallback, useRef, useState } from 'react';

const ImageCard = styled(Card)`
  width: 300px;
  height: 300px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  .error {
    color: red;
  }
`;

const MB = 1024 * 1024 * 2; // 2MB

const openFileDialog = (inputRef) => {
	if (inputRef.current) inputRef.current.click();
};

export const UploadImage = ({ onChange }) => {
	const inputRef = useRef(null);
	const [ imageSrc, setImageSrc ] = useState('');
	const [ error, setError ] = useState('');
	const { t } = useTranslation();

	const handleClickInput = useCallback(() => openFileDialog(inputRef), [inputRef]);	

	const onImageUpdate = (e) => {
		const file = e.currentTarget.files[0];
		if (!file) return;

		if (file.size > MB) {
			setError(t('uploadImage.errors.maxFileSize'));
			return;
		}

		const fileType = file.type;
		if (!fileType.includes('jpeg') && !fileType.includes('png')) {
			setError(t('uploadImage.errors.allowType'));
			return;
		}

		// Check image dimensions
		const img = new Image();
		img.src = URL.createObjectURL(file);
		img.onload = () => {
			if (img.width < 500 || img.height < 500) {
				setError(t('uploadImage.errors.resolution'));
			} else if (img.width === img.height) {
				setImageSrc(img.src);
				setError('');
				if (onChange) onChange(file);
			} else {
				setError(t('uploadImage.errors.resolution'));
			}
		};
		img.onerror = () => {
			setError('Error loading image');
		};

		e.currentTarget.blur();
	};

	const _renderError = (error) => {
		if (error) {
			return (
				<div className="mb-2">
					{error && <span className="error">{t(error)}</span>}
				</div>
			);
		}
		return null;
	};

	const _renderImage = (image) => {
		if (image) {
			return (
				<div>
					<img src={image} width={300} height={300} />
					<CustomButton onClick={handleClickInput} outline large className="mt-4">
						{t('uploadImage.update')}
					</CustomButton>
				</div>
			);
		}
		return (
			<ImageCard className="justify-center flex items-center flex-col cursor-pointer" onClick={handleClickInput}>
				<div className="items-center flex flex-col mt-3 text-center">
					<HiOutlinePhoto size={36} />
					<p className="mt-4">{t('uploadImage.placeholder')}</p>
				</div>
			</ImageCard>
		);
	};

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg, image/png"
				style={{ display: 'none' }}
				onChange={onImageUpdate}
			/>
			<Wrapper className={error ? 'error-invalid' : ''}>
				<div className="justify-center flex items-center flex-col">
					{_renderError(error)}
					{_renderImage(imageSrc)}
				</div>
			</Wrapper>
		</>
	);
};
