// Gray box that shows a sprite. Size the box via className and the image via imgClassName.
export default function SpriteBox({
  src,
  alt,
  className = '',
  imgClassName = 'object-contain',
  rounded = 'rounded-lg',
  loading,
}) {
  return (
    <div className={`flex items-center justify-center bg-well ${rounded} ${className}`.trim()}>
      <img src={src} alt={alt} className={imgClassName} loading={loading} />
    </div>
  )
}
