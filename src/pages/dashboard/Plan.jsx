// src/pages/Plans.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import PaymentController from "../../controllers/PaymentController";
import Swal from "sweetalert2";

const baseUrl = import.meta.env.VITE_API_URL;

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserPlan, setCurrentUserPlan] = useState(null);
  const [userTasksCount, setUserTasksCount] = useState(0);
  const { payWithMidtrans } = PaymentController();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Fetch plans and user data simultaneously
        const [plansRes, userRes] = await Promise.all([
          axios.get(`${baseUrl}/plans`),
          axios.get(`${baseUrl}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setPlans(plansRes.data);
        setCurrentUserPlan(userRes.data.plan);
        setUserTasksCount(userRes.data.tasks_count || 0);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal memuat data paket",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkTaskLimit = async (planId) => {
    const selectedPlan = plans.find(plan => plan.id === planId);
    
    if (currentUserPlan && userTasksCount >= currentUserPlan.tasks_limit) {
      await Swal.fire({
        icon: "warning",
        title: "Batas Task Tercapai!",
        html: `
          <div class="text-center">
            <p class="mb-3">Anda telah mencapai batas maksimum <strong>${currentUserPlan.tasks_limit} task</strong> untuk paket <strong>${currentUserPlan.name}</strong>.</p>
            <p class="text-sm text-gray-600">Upgrade ke paket yang lebih tinggi untuk menambah lebih banyak task!</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Upgrade Sekarang",
        cancelButtonText: "Nanti Saja",
        confirmButtonColor: "#06b6d4",
      }).then((result) => {
        if (result.isConfirmed) {
          payWithMidtrans(selectedPlan.id);
        }
      });
    } else {
      payWithMidtrans(planId);
    }
  };

  const renderPlanCard = (plan) => {
    const isCurrentPlan = currentUserPlan?.id === plan.id;
    const features = plan.features ? JSON.parse(plan.features) : [];
    
    return (
      <div
        key={plan.id}
        className={`relative rounded-lg shadow-lg p-6 transition-all duration-300 hover:scale-[1.02] ${
          plan.is_popular 
            ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-2 border-purple-400' 
            : 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white'
        }`}
        style={{
          background: plan.is_popular 
            ? `linear-gradient(135deg, ${plan.color}dd, ${plan.color})`
            : `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)`
        }}
      >
        {plan.is_popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-yellow-400 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
              🌟 TERPOPULER
            </span>
          </div>
        )}
        
        {isCurrentPlan && (
          <div className="absolute -top-3 right-4">
            <span className="bg-green-400 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
              ✓ AKTIF
            </span>
          </div>
        )}

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
          <p className="text-gray-200 text-sm mb-4">{plan.description}</p>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-yellow-300">
              {plan.price === 0 ? 'Gratis' : `Rp ${plan.price.toLocaleString()}`}
            </span>
            {plan.price > 0 && (
              <span className="text-gray-200 text-sm">/bulan</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => checkTaskLimit(plan.id)}
          disabled={isCurrentPlan}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 ${
            isCurrentPlan
              ? 'bg-gray-400 cursor-not-allowed text-gray-700'
              : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-lg border-2 border-yellow-400'
          }`}
        >
          {isCurrentPlan ? 'Paket Aktif' : `Pilih ${plan.name}`}
        </button>
        
        {isCurrentPlan && currentUserPlan && (
          <div className="mt-3 text-center text-sm">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <span className="text-yellow-300">
                Task terpakai: {userTasksCount}/{currentUserPlan.tasks_limit}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((userTasksCount / currentUserPlan.tasks_limit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div 
        className="bg-gradient-to-br from-cyan-500 to-teal-600 p-7 mb-8 shadow-inner rounded-lg text-center"
        data-aos="fade-down"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Pilih Paket Premium</h1>
        <p className="text-cyan-100">Tingkatkan produktivitas dengan fitur-fitur premium kami</p>
      </div>
      
      {loading ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
          {/* Render skeleton berdasarkan jumlah plans yang diharapkan (4) */}
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-md p-6 animate-pulse"
            >
              {/* Popular badge skeleton */}
              {index === 2 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
                </div>
              )}
              
              {/* Plan name skeleton */}
              <div className="text-center mb-4">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto mb-3"></div>
                
                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                  <div className="h-3 bg-gray-200 rounded-full w-4/5 mx-auto"></div>
                </div>
                
                {/* Price skeleton */}
                <div className="h-10 bg-gray-200 rounded-lg w-2/3 mx-auto mb-4"></div>
              </div>
              
              {/* Features skeleton */}
              <div className="mb-6 space-y-3">
                {[...Array(index + 3)].map((_, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-3 bg-gray-200 rounded-full flex-1"></div>
                  </div>
                ))}
              </div>
              
              {/* Button skeleton */}
              <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
          {plans.map(renderPlanCard)}
        </div>
      )}
      
      {!loading && (
        <div className="mt-12 text-center" data-aos="fade-up">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              💡 Butuh bantuan memilih paket?
            </h3>
            <p className="text-gray-600 mb-4">
              Tim kami siap membantu Anda menemukan paket yang sesuai dengan kebutuhan
            </p>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors">
              Hubungi Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Plans;