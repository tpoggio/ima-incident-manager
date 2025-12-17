import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Button, Input, Select } from '@/components/ui';
import type { CreateIncidentDTO } from '@/types';

const servicioKeys = ['INTERNET', 'TELEFONIA', 'MPLS', 'OTRO'] as const;
const canalKeys = ['WEB', 'CALL_CENTER', 'WHATSAPP', 'EMAIL', 'COMERCIAL'] as const;

const incidentSchema = z.object({
  titulo: z.string().min(5),
  descripcion: z.string().min(10),
  servicio: z.enum(servicioKeys),
  canal: z.enum(canalKeys),
  instalador: z.string().min(2),
  cliente: z.string().min(2),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

interface IncidentFormProps {
  onSubmit: (data: CreateIncidentDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    ['link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
  ],
};

export function IncidentForm({ onSubmit, onCancel, isLoading }: IncidentFormProps) {
  const { t } = useTranslation();

  const servicioOptions = servicioKeys.map(key => ({
    value: key,
    label: t(`services.${key}`),
  }));

  const canalOptions = canalKeys.map(key => ({
    value: key,
    label: t(`channels.${key}`),
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      servicio: undefined,
      canal: undefined,
      instalador: '',
      cliente: '',
    },
  });

  const handleFormSubmit = (data: IncidentFormData) => {
    onSubmit(data as CreateIncidentDTO);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label={t('form.titleLabel')}
        placeholder={t('form.titlePlaceholder')}
        error={errors.titulo ? t('form.titleError') : undefined}
        {...register('titulo')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('form.descriptionLabel')}
        </label>
        <Controller
          name="descripcion"
          control={control}
          render={({ field }) => (
            <ReactQuill
              theme="snow"
              value={field.value}
              onChange={field.onChange}
              modules={quillModules}
              placeholder={t('form.descriptionPlaceholder')}
              className="bg-white rounded-lg"
            />
          )}
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-500">{t('form.descriptionError')}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label={t('form.serviceLabel')}
          options={servicioOptions}
          placeholder={t('form.servicePlaceholder')}
          error={errors.servicio ? t('form.serviceError') : undefined}
          {...register('servicio')}
        />

        <Select
          label={t('form.channelLabel')}
          options={canalOptions}
          placeholder={t('form.channelPlaceholder')}
          error={errors.canal ? t('form.channelError') : undefined}
          {...register('canal')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t('form.installerLabel')}
          placeholder={t('form.installerPlaceholder')}
          error={errors.instalador ? t('form.installerError') : undefined}
          {...register('instalador')}
        />

        <Input
          label={t('form.clientLabel')}
          placeholder={t('form.clientPlaceholder')}
          error={errors.cliente ? t('form.clientError') : undefined}
          {...register('cliente')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}
