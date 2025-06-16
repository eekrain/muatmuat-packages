import { MapPin } from "lucide-react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { fetcherMuatparts } from "@/lib/axios";
import { normalizeLocationDataForSaving } from "@/lib/normalizers/location";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

export const FormSimpanLokasiScreen = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  console.log("🚀 ~ FormSimpanLokasi ~ params:", params);
  const { formValues, formErrors, setField, reset, validateSimpanLokasi } =
    useLocationFormStore();

  formValues.dataLokasi.coordinates.latitude;

  useShallowCompareEffect(() => {
    if (params.defaultValues) {
      reset(params.defaultValues);
    }
  }, [params.defaultValues]);

  const handleSave = () => {
    const isValid = validateSimpanLokasi();
    if (!isValid) return;

    if (params.mode === "add") {
      fetcherMuatparts
        .post("v1/muatparts/profile/location", {
          param: normalizeLocationDataForSaving(formValues),
        })
        .then((response) => {
          console.log("🚀 ~ handleSave ~ response:", response);
          navigation.pop();
          setTimeout(() => {
            toast.success("Lokasi berhasil ditambah");
          }, 200);
        })
        .catch((error) => {
          console.error("Error when adding location:", error);
          toast.error("Gagal menambah lokasi");
        });
    } else if (params.mode === "update") {
      console.log("update");
      fetcherMuatparts
        .put("v1/muatparts/profile/location", {
          param: {
            ...normalizeLocationDataForSaving(formValues),
            ID: params.idToUpdate,
          },
        })
        .then((response) => {
          console.log("🚀 ~ handleSave ~ response:", response);
          navigation.pop();
          setTimeout(() => {
            toast.success("Lokasi berhasil diubah");
          }, 200);
        })
        .catch((error) => {
          console.error("Error when saving location:", error);
          toast.error("Gagal mengubah lokasi");
        });
    }
  };

  return (
    <FormResponsiveLayout
      title={{
        label: params.layout?.title || "Ubah Lokasi",
      }}
      className="bg-neutral-50 pb-[80px]"
    >
      <div className="grid h-full grid-cols-1 gap-3 p-4 text-sm">
        {/* Nama Lokasi */}
        <div className="space-y-2">
          <FormLabel variant="small" required>
            Nama Lokasi
          </FormLabel>
          <Input
            placeholder="Masukkan nama lokasi"
            value={formValues.namaLokasi}
            onChange={(e) => {
              setField("namaLokasi", e.currentTarget.value);
            }}
            errorMessage={formErrors.namaLokasi}
          />
        </div>

        {/* Lokasi */}
        <div className="space-y-2">
          <FormLabel variant="small" required>
            Lokasi
          </FormLabel>
          <div className="flex items-center gap-3 rounded-md border p-3">
            <MapPin className="h-5 w-5 flex-shrink-0" />
            <span className="line-clamp-1 text-sm text-gray-700">
              {formValues.dataLokasi?.location?.name}
            </span>
          </div>
        </div>

        {/* Detail Lokasi */}
        <div className="space-y-2">
          <FormLabel variant="small" required>
            Detail Lokasi
          </FormLabel>
          <div className="relative">
            <textarea
              className={cn(
                "w-full rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2 outline-none hover:border-primary-700 focus:border-primary-700",
                formErrors.detailLokasi && "border-red-500"
              )}
              placeholder="Masukkan detail lokasi"
              multiline="true"
              rows={5}
              maxLength={500}
              value={formValues.detailLokasi}
              onChange={(e) => {
                if (e.currentTarget.value.length > 500) return;
                setField("detailLokasi", e.currentTarget.value);
              }}
            />
            <div className="text-right text-xs text-gray-400">
              {formValues.detailLokasi?.length || 0}/{500}
            </div>
            {formErrors.detailLokasi && (
              <span className="text-xs font-medium text-error-400">
                {formErrors.detailLokasi}
              </span>
            )}
          </div>
        </div>

        {/* Location Details - Read Only */}
        <div>
          <span className="font-bold">Kecamatan</span>
          <div className="mt-1">{formValues.dataLokasi?.district?.name}</div>
        </div>

        <div>
          <span className="font-bold">Kota</span>
          <div className="mt-1">{formValues.dataLokasi?.city?.name}</div>
        </div>

        <div>
          <span className="font-bold">Provinsi</span>
          <div className="mt-1">{formValues.dataLokasi?.province?.name}</div>
        </div>

        <div>
          <span className="font-bold">Kode Pos*</span>
          <div className="mt-1">{formValues.dataLokasi?.postalCode?.name}</div>
        </div>
        {/* Nama PIC */}
        <div className="space-y-2">
          <FormLabel variant="small" required>
            Nama PIC*
          </FormLabel>

          <Input
            placeholder="Masukkan nama PIC"
            value={formValues.namaPIC}
            onChange={(e) => {
              setField("namaPIC", e.currentTarget.value);
            }}
            errorMessage={formErrors.namaPIC}
          />
        </div>

        {/* No. HP PIC */}
        <div className="space-y-2">
          <FormLabel variant="small" required>
            No. HP PIC*
          </FormLabel>

          <Input
            placeholder="Masukkan no. HP PIC"
            value={formValues.noHPPIC}
            onChange={(e) => {
              setField("noHPPIC", e.currentTarget.value);
            }}
            errorMessage={formErrors.noHPPIC}
          />
        </div>

        {/* Checkbox */}
        <div className="pt-2">
          <Checkbox
            label="Jadikan alamat sebagai alamat utama"
            checked={formValues.isMainAddress}
            onChange={(e) => {
              setField("isMainAddress", e.checked);
            }}
          />
        </div>

        <ResponsiveFooter className="flex gap-3">
          <Button
            variant="muatparts-primary-secondary"
            className="flex-1"
            onClick={() => navigation.pop()}
            type="button"
          >
            Batalkan
          </Button>
          <Button
            variant="muatparts-primary"
            className="flex-1"
            onClick={handleSave}
            type="button"
          >
            Simpan
          </Button>
        </ResponsiveFooter>
      </div>
    </FormResponsiveLayout>
  );
};
