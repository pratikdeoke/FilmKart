export const processPayment = async ({ bookingId, userEmail }) => {
  // simulate delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // random success/failure
  const isSuccess = Math.random() > 0.2;

  if (!isSuccess) {
    throw new Error("Payment failed");
  }

  return {
    status: "SUCCESS",
    transactionId: `txn_${Date.now()}`
  };
};