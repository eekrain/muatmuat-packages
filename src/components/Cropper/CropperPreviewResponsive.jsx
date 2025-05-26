import HeaderMobile from "@/container/HeaderMobile/HeaderMobile"
import Button from "../Button/Button"
import Image from "next/image"
import toast from "@/store/zustand/toast";
import IconComponent from "../IconComponent/IconComponent";
import Toast from "../Toast/Toast";

const CropperPreviewResponsive = ({
    src,
    title = "Upload Foto",
    setIsShowPreview,
    onConfirm= () => {},
    uploadOptions,
    onCancelCrop,
    // 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066
    description = "Max. size foto 10MB"
}) => {
    const { setShowBottomsheet, setTitleBottomsheet, setDataBottomsheet } = toast();

    const handleEditImage = () => {
        setShowBottomsheet(true)
        setTitleBottomsheet(" -")
        setDataBottomsheet(
        <div className="flex justify-around">
            {uploadOptions.map((option, key) => (
            <div className="flex flex-col gap-y-4 items-center" key={key}>
                <div className="p-5 bg-primary-700 cursor-pointer rounded-[50px] size-16" onClick={option.onClick}>
                <IconComponent
                    src={option.src}
                    size="medium"
                />
                </div>
                <span className="font-semibold text-[16px] leading-[19.2px]">{option.title}</span>
            </div>
            ))}
        </div>
        )
    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen z-[102] bg-white">
            {/* LB - 0447, 25.03 */}
            <Toast/>
            <HeaderMobile
                onBack={() => {
                    onCancelCrop()
                    setIsShowPreview(false)
                }}
                title={title}
            />
            <div className="min-h-screen h-full flex flex-col items-center mt-[62px]">
                <div className="bg-[#cccccc] w-full aspect-square flex justify-center p-4">
                    <div className="rounded-full bg-neutral-50 overflow-hidden">
                        <Image
                            alt="preview"
                            className="size-full"
                            src={src}
                            width={100}
                            height={100}
                        />
                    </div>
                </div>
                <Button
                    Class="h-10 px-6 mt-6"
                    color="primary_secondary"
                    onClick={handleEditImage}
                >
                    Ubah Foto
                </Button>
                <div className="mt-3 font-medium text-[14px] leading-[16.8px] text-[#676767]">
                    {/* 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066 */}
                    {description}
                </div>
            </div>
            <div className="fixed bottom-0 left-0 bg-neutral-50 w-full py-3 px-4 shadow-muat">
                <Button
                    Class="h-8 w-full max-w-full"
                    color="primary"
                    onClick={onConfirm}
                >
                    Simpan Foto
                </Button>
            </div>
        </div>
    )
}

export default CropperPreviewResponsive