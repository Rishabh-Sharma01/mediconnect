import { async } from '@firebase/util';
import { message } from 'antd';
import { doc } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { BookDoctorAppointment, GetDoctorAppointmentsOnDate } from '../../apicalls/appointments';
import { GetDoctorById } from '../../apicalls/doctor';
import { ShowLoader } from '../../redux/loaderSlice';

function BookAppointment() {
    const [problem = "", setProblem] = React.useState("");
    const [doctor, setDoctor] = React.useState(null);
    const [date = "", setDate] = React.useState("");
    const [selectedSlot = "", setSelectedSlot] = React.useState("");
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [bookedSlots = [], setBookedSlots] = React.useState([]);
    const getData = async () => {
        try {
            dispatch(ShowLoader(true));
            const response = await GetDoctorById(id);
            if (response.success) {
                setDoctor(response.data);
            } else {
                message.error(response.message);
            }

            dispatch(ShowLoader(false));
        } catch (error) {
            message.error(error.message);
            dispatch(ShowLoader(false));
        }
    }

    const getSlotsData = () => {
        const day = moment(date).format('dddd');
        if (!doctor.days.includes(day)) {
            {
                return (<h3>Doctor is not Available on {moment(date).format('DD-MM-YYYY')}</h3>);
            }
        }
        let startTime = moment(doctor.startTime, "HH:mm");
        let endTime = moment(doctor.endTime, "HH:mm");
        let slotDuration = 60;
        const slots = [];
        while (startTime < endTime) {
            slots.push(startTime.format("HH:mm"));
            startTime.add(slotDuration, "minutes");
        }

        return slots.map((slot) => {
            const isBooked = bookedSlots?.find(
                (bookedSlots) => bookedSlots.slot === slot && bookedSlots.status !=='cancelled'
            );
            return (<div className='bg-white p-1 cursor-pointer'
                onClick={() => { setSelectedSlot(slot) }}
                style={{
                    border: selectedSlot === slot ? "3px solid green" : "1px solid gray",
                    backgroundColor: isBooked ? "gray" : "white",
                    pointerEvents: isBooked ? "none" : "auto",
                    cursor: isBooked ? "not-allowed" : "pointer",
                }}
            >
                <span>
                    {moment(slot, "HH:mm A").format("h:mm A")} -{" "}
                    {moment(slot, "HH:mm A").add(slotDuration, "minutes").format("h:mm A")}
                </span>
            </div>
            );
        });
    };

    const onBookAppointment = async () => {
        try {
            dispatch(ShowLoader(true));
            const payload = {
                doctorId: doctor.id,
                userId: JSON.parse(localStorage.getItem("user")).id,
                date,
                slot: selectedSlot,
                doctorName: `${doctor.firstName} ${doctor.lastName}`,
                userName: JSON.parse(localStorage.getItem("user")).name,
                bookedOn: moment().format("DD-MM-YYYY hh:mm A"),
                problem,
                status:"pending",
            };
            const response = await BookDoctorAppointment(payload);
            if (response.success) {
                message.success(response.message);
                navigate("/profile");
            } else {
                message.error(response.message);
            }
            dispatch(ShowLoader(false));
        } catch (error) {
            message.error(error.message);
            dispatch(ShowLoader(false));
        }
    }

    const getBookedSlots = async () => {
        try {
            dispatch(ShowLoader(true));
            const response = await GetDoctorAppointmentsOnDate(id, date);
            dispatch(ShowLoader(false));
            if (response.success) {
                console.log(response.data);
                setBookedSlots(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(ShowLoader(false));
            message.error(error.message);
        }
    }
    useEffect(() => {
        getData()
    }, [id])

    useEffect(() => {
        if (date) {
            getBookedSlots();
        }
    }, [date]);
    return (
        doctor && (
            <div className='bg-white p-2 '>
                <h1 className='uppercase my-1'>
                    Dr.{doctor?.firstName} {doctor?.lastName}
                </h1>
                <hr />

                <div className='w-half flex flex-col gap-1 my-1 uppercase'>
                    <div className='flex justify-between w-full'>
                        <h4>
                            <b>
                                Speciality : </b>
                        </h4>
                        <h4>
                            {doctor.speciality}
                        </h4>
                    </div>
                    <div className='flex justify-between w-full'>
                        <h4>
                            <b>
                                Experience(in years) : </b>
                        </h4>
                        <h4>
                            {doctor.experience}
                        </h4>
                    </div>
                    <div className='flex justify-between w-full'>
                        <h4>
                            <b>
                                Email : </b>
                        </h4>
                        <h4>
                            {doctor.email}
                        </h4>
                    </div>
                    <div className='flex justify-between w-full'>
                        <h4>
                            <b>
                                Address : </b>
                        </h4>
                        <h4>
                            {doctor.address}
                        </h4>
                    </div>
                    <div className='flex justify-between w-full'>
                        <h4>
                            <b>
                                Phone : </b>
                        </h4>
                        <h4>
                            {doctor.phone}
                        </h4>
                    </div>
                    <div className='flex justify-between w-full'>
                        <h4>
                            <b>
                                Fee : </b>
                        </h4>
                        <h4>
                            {doctor.fee}/- per session
                        </h4>
                    </div>
                    <div className='flex justify-between w-full'>
                        <h4>
                            <b>
                                Days Available : </b>
                        </h4>
                        <h4>
                            {doctor.days.join(',')}
                        </h4>
                    </div>
                </div>

                <hr />
                {/* slots here */}
                <div className='flex flex-col gap-1 my-2'>
                    <div className='flex gap-2 w-400 items-end'>
                        <div>
                            <span>Select Date :</span>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                min={moment().format('YYYY-MM-DD')}
                            />
                        </div>
                    </div>
                    <div className='flex gap-2'>{date && getSlotsData()}</div>
                    {selectedSlot && (
                        <div>
                            <textarea
                                placeholder='Enter your Problem here'
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                rows="10"></textarea>
                            <div className='flex gap-2 justify-center'>
                                <button
                                    className='outlinedbtn'
                                    onClick={() => { navigate("/") }}
                                >
                                    Cancel
                                </button>
                                <button className='containedbtn'
                                    onClick={onBookAppointment}
                                >Book  Appointment</button>
                            </div>
                            </div>
                    )}
                        </div>

            </div>
                )
                );
}

                export default BookAppointment
