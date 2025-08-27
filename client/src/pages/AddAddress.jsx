import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

// InputField component with simple validation display
const InputField = ({ type, placeholder, name, handleChange, address, error }) => (
  <>
    <input
      className={`w-full px-2 py-2.5 border rounded outline-none text-gray-700 focus:border-primary transition
        ${error ? 'border-red-500' : 'border-gray-500/30'}`}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      name={name}
      value={address[name]}
      required
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </>
)

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext()

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }))

    // Clear errors on input change
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  // Basic simple validations - you can expand as needed
  const validate = () => {
    const newErrors = {}
    if (!address.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!address.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!address.email.trim()) newErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(address.email)) newErrors.email = 'Email is invalid'
    if (!address.street.trim()) newErrors.street = 'Street is required'
    if (!address.city.trim()) newErrors.city = 'City is required'
    if (!address.state.trim()) newErrors.state = 'State is required'
    if (!address.zipcode.trim()) newErrors.zipcode = 'Zipcode is required'
    if (!address.country.trim()) newErrors.country = 'Country is required'
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\+?\d{7,15}$/.test(address.phone)) newErrors.phone = 'Phone number is invalid'
    return newErrors
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      const { data } = await axios.post('/api/address/add', { address })
      if (data.success) {
        toast.success(data.message)
        navigate('/cart')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/cart')
    }
  }, [])

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-700">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="firstName" type="text" placeholder="First Name" error={errors.firstName} />
              <InputField handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Last Name" error={errors.lastName} />
            </div>
            <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="Email address" error={errors.email} />
            <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="Street" error={errors.street} />
            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="City" error={errors.city} />
              <InputField handleChange={handleChange} address={address} name="state" type="text" placeholder="State" error={errors.state} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="zipcode" type="text" placeholder="Zipcode" error={errors.zipcode} />
              <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="Country" error={errors.country} />
            </div>
            <InputField handleChange={handleChange} address={address} name="phone" type="text" placeholder="Phone" error={errors.phone} />
            <button
              type="submit"
              className="w-full mt-16 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase font-semibold"
            >
              Save Address
            </button>
          </form>
        </div>
        <img className="md:mr-16 mb-16 md:mt-0" src={assets.add_address_iamge} alt="Add Address" />
      </div>
    </div>
  )
}

export default AddAddress
