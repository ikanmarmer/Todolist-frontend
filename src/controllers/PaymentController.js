// src/controllers/PaymentController.js
import axios from "axios";
import Swal from "sweetalert2";
import AuthController from "./AuthController";

const baseUrl = import.meta.env.VITE_API_URL;

const PaymentController = () => {
  
  const checkUserTaskLimit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/user/tasks/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Gagal mengecek batas task:", error);
      return null;
    }
  };

  const showTaskLimitAlert = async (currentPlan, tasksCount) => {
    return await Swal.fire({
      icon: "warning",
      title: "⚠️ Batas Task Tercapai!",
      html: `
        <div class="text-center space-y-3">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 font-semibold">
              Anda telah menggunakan <span class="font-bold text-red-600">${tasksCount}/${currentPlan.tasks_limit}</span> task
            </p>
            <p class="text-red-600 text-sm mt-1">
              Paket ${currentPlan.name} Anda sudah mencapai batas maksimum
            </p>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-800 text-sm">
              💡 <strong>Upgrade sekarang</strong> untuk mendapatkan lebih banyak task dan fitur premium lainnya!
            </p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "🚀 Upgrade Sekarang",
      cancelButtonText: "Nanti Saja",
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    });
  };

  const createOrder = async (planId = 1) => {
    try {
      const token = localStorage.getItem("token");
      
      // Check task limit before creating order
      const taskData = await checkUserTaskLimit();
      if (taskData && taskData.current_count >= taskData.limit) {
        const result = await showTaskLimitAlert(taskData.plan, taskData.current_count);
        if (!result.isConfirmed) {
          return null; // User cancelled
        }
      }
      
      const res = await axios.post(
        `${baseUrl}/orders`,
        { plan_id: planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order response:", res.data);

      if (!res.data.order?.id) {
        throw new Error(res.data.message || "Order tidak valid.");
      }

      return res.data.order;
    } catch (error) {
      console.error("Gagal membuat order:", error.response
    ? JSON.stringify(error.response.data, null, 2)
    : error.message);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const message = error.response.data.message;
        if (message.includes('already subscribed')) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: "Anda sudah berlangganan paket ini",
          });
        } else if (message.includes('Cannot downgrade')) {
          Swal.fire({
            icon: "warning",
            title: "Tidak Dapat Downgrade",
            text: "Anda tidak dapat menurunkan ke paket dengan limit task yang lebih sedikit",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Gagal membuat pesanan",
        });
      }
      
      throw error;
    }
  };

  const createPayment = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/payments`,
        { order_id: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.payment.snap_token;
    } catch (err) {
      console.error("Gagal membuat payment:", err.response?.data || err);
      throw err;
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Create a link to download the invoice
      const link = document.createElement('a');
      link.href = `${baseUrl}/invoice/download/${orderId}?token=${token}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Invoice Downloaded",
        text: "Invoice berhasil didownload!",
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error("Gagal download invoice:", error);
      Swal.fire({
        icon: "error",
        title: "Download Gagal",
        text: "Gagal mendownload invoice. Silakan coba lagi.",
      });
    }
  };

  const payWithMidtrans = async (planId) => {
    // Show loading
    Swal.fire({
      title: 'Memproses...',
      html: 'Sedang menyiapkan pembayaran',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const order = await createOrder(planId);
      
      if (!order) {
        Swal.close();
        return; // User cancelled due to task limit
      }
      
      const snapToken = await createPayment(order.id);
      
      Swal.close();

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async (result) => {
            console.log("Pembayaran sukses", result);

            // Show success message with animation
            await Swal.fire({
              icon: "success",
              title: "🎉 Pembayaran Berhasil!",
              html: `
                <div class="text-center space-y-3">
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p class="text-green-800 font-semibold">
                      Selamat! Paket premium Anda telah aktif
                    </p>
                    <p class="text-green-600 text-sm mt-1">
                      Invoice akan otomatis didownload
                    </p>
                  </div>
                </div>
              `,
              confirmButtonText: "Lanjutkan",
              confirmButtonColor: "#10b981",
              timer: 3000,
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            });

            // Download invoice
            const orderId = result.order_id.split("-")[0];
            await downloadInvoice(orderId);

            // Logout and redirect
            const { logout } = AuthController.getState();
            logout();
            
            // Show final message before redirect
            await Swal.fire({
              icon: "info",
              title: "Sesi Berakhir",
              text: "Silakan login kembali untuk menggunakan fitur premium",
              confirmButtonText: "Login Sekarang",
              allowOutsideClick: false,
              allowEscapeKey: false
            });
            
            window.location.href = "/login";
          },
          
          onPending: (result) => {
            console.log("Menunggu pembayaran", result);
            Swal.fire({
              icon: "info",
              title: "Pembayaran Pending",
              text: "Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran.",
              confirmButtonText: "OK"
            });
          },
          
          onError: (error) => {
            console.error("Pembayaran gagal", error);
            Swal.fire({
              icon: "error",
              title: "❌ Pembayaran Gagal",
              html: `
                <div class="text-center space-y-3">
                  <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p class="text-red-800">
                      Terjadi kesalahan saat memproses pembayaran
                    </p>
                    <p class="text-red-600 text-sm mt-1">
                      Silakan coba lagi atau hubungi customer service
                    </p>
                  </div>
                </div>
              `,
              confirmButtonText: "Coba Lagi",
              confirmButtonColor: "#ef4444"
            });
          },
          
          onClose: () => {
            console.log("Popup ditutup oleh user");
            Swal.fire({
              icon: "info",
              title: "Pembayaran Dibatalkan",
              text: "Anda dapat melanjutkan pembayaran kapan saja.",
              timer: 2000,
              showConfirmButton: false
            });
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Midtrans Snap belum tersedia. Silakan refresh halaman.",
        });
      }
    } catch (err) {
      Swal.close();
      console.error("DETAIL ERROR:", JSON.stringify(err.response?.data, null, 2));
      
      if (!err.response) {
        // Network or connection error
        Swal.fire({
          icon: "error",
          title: "Koneksi Bermasalah",
          text: "Periksa koneksi internet Anda dan coba lagi.",
        });
      }
      // Other errors are already handled in createOrder
    }

    
  };

  return {
    payWithMidtrans,
    checkUserTaskLimit,
    downloadInvoice
  };
};

export default PaymentController;