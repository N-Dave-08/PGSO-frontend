import React from 'react'
import { faqData } from '@/helpers/pageData'
import { Mail } from 'lucide-react'

export default function FAQ() {
    return (
        <section className='relative z-10 flex justify-center items-center h-screen gap-10 px-40'>
            <div className='space-y-5 w-1/2'>
                <h4 className='text-2xl font-semibold text-center'>Frequently Asked Questions</h4>
                <div className='space-y-1'>
                    {
                        faqData.map((faq, i) => (
                            <div className="collapse collapse-arrow bg-base-200" key={i}>
                                <input type="radio" name="accordion" />
                                <div className="collapse-title text-xl font-medium">{faq.question}</div>
                                <div className="collapse-content">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='w-1/3 space-y-5'>
                <h4 className='text-2xl font-semibold text-center'>Still Have Questions?</h4>
                <form className='bg-neutral p-5 rounded-box flex flex-col gap-3'>
                    <label className="input input-bordered flex items-center gap-2">
                        <Mail className='fill-base-content text-base-100'/>
                        <input type="text" className="grow" placeholder="Email" />
                    </label>
                    <textarea className="textarea textarea-bordered" placeholder="Message"></textarea>
                    <button className="btn">Send</button>
                </form>
            </div>
        </section>
    )
}
