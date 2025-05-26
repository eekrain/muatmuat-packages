'use client'
import React, { forwardRef, useState } from 'react'
import style from './Input.module.scss'
import PropTypes from 'prop-types'
import IconComponent from "../IconComponent/IconComponent"
import isEmpty from "lodash/isEmpty"

const Input = forwardRef(({
  name,
  type='text',
  placeholder = 'Placeholder',
  disabled = false,
  status = null,
  icon = {left: '', right: ''},
  text = {left: '', right: ''},
  supportiveText = {title: '', desc: ''},
  width = {width: '', maxWidth: '', minWidth: ''},
  changeEvent = () => {},
  focusEvent = () => {},
  blurEvent = () => {},
  classname,
  classInput,
  ...props
},ref) => {
    return (
      <div className={`flex flex-col gap-y-2 ${classname} inputClassName`} style={{width: width.width, maxWidth: width.maxWidth, minWidth: width.minWidth}}>
        <div className={`flex w-full h-8 items-center cursor-pointer border border-neutral-600 rounded-md px-3 ${disabled && style.input_disabled} ${style.input_style}
        ${status == 'error' ? style.border_red :
        status == 'success' ? style.border_success :
        ''
        } bg-neutral-50`}>
          {!isEmpty(icon.left) ? (
            <div className="mr-2 flex items-center">
              {typeof icon.left==='string'? (
                <IconComponent loader={false} src={{src: icon.left}} height={16} width={16}
                classname={`${status == 'error' ? style.icon_danger : status == 'success' ? style.icon_success : ''}`}
              /> ) : icon.left}
            </div>
          ) : null}
          {text.left ? <span className="mr-3 text-[12px] leading-[14.4px] font-medium text-neutral-900 max-[600px]:text-[14px] max-[600px]:leading-[15.4px] max-[600px]:font-semibold">{text.left}</span> : null}
          <input {...props} type={type} onChange={changeEvent} ref={ref} name={name} placeholder={placeholder} onFocus={focusEvent} onBlur={blurEvent} className={`min-w-[0px] w-full ${style.input} ${classInput} text-[12px] leading-[14.4px] font-medium text-neutral-900 max-[600px]:text-[14px] max-[600px]:leading-[15.4px] max-[600px]:font-semibold placeholder:text-neutral-600`} disabled={disabled}/>
          {!isEmpty(icon.right) ? (
            <div className="ml-2 flex items-center">
              {typeof icon.right==='string'? (
                <IconComponent loader={false} src={{src: icon.right}} height={16} width={16}
                classname={`${status == 'error' ? style.icon_danger : status == 'success' ? style.icon_success : ''}`}
              /> ) : icon.right}
            </div>
          ) : null}
          {text.right ? <span className='ml-3 text-[12px] leading-[14.4px] font-medium text-neutral-900 max-[600px]:text-[14px] max-[600px]:leading-[15.4px] max-[600px]:font-semibold'>{text.right}</span> : null}
        </div>
        {
          (supportiveText.title || supportiveText.desc) &&
          <div className={`flex justify-between items-center ${style.supportive_text}
          ${status == 'error' ? style.text_danger :
          status == 'success' ? style.text_success :
          ''
          }`}>
            <span>{supportiveText.title}</span>
            <span>{supportiveText.desc}</span>
          </div>
        }
      </div>
    )
})

Input.displayName="Input";

Input.propTypes= {
    placeholder:PropTypes.string,
    type:PropTypes.oneOf(['text','number', 'email', 'password']),
    name:PropTypes.string,
    classname: PropTypes.string,
    disabled: PropTypes.bool,
    status: PropTypes.oneOf(['success', 'error']),
    icon: PropTypes.object,
    text: PropTypes.object,
    supportiveText: PropTypes.object,
    width: PropTypes.object,
}


export default Input;