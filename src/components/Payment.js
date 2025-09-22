import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import { useCart } from "./CartProvider";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  // const { cartItems } = useCart();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("gpay");

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const [upiId, setUpiId] = useState("");

  const [netBanking, setNetBanking] = useState({
    bankName: "",
    accountNumber: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    const userEmail = sessionStorage.getItem("email");
    if (!userEmail) return;

    const stored = localStorage.getItem(`addresses_${userEmail}`);
    const parsedAddresses = stored ? JSON.parse(stored) : [];
    setAddresses(parsedAddresses);

    if (parsedAddresses.length > 0) {
      setSelectedAddress(
        `${parsedAddresses[0].name}, ${parsedAddresses[0].street}, ${parsedAddresses[0].city}, ${parsedAddresses[0].state} - ${parsedAddresses[0].pincode}, Ph: ${parsedAddresses[0].mobile}`
      );
    }

    setPaymentMethod("gpay");
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = subtotal * 0.1;
  const shipping = subtotal > 2000 ? 0 : 100;

  const cgst = (subtotal - discount) * 0.09;
  const sgst = (subtotal - discount) * 0.09;
  const igst = 0;
  const total = subtotal - discount + cgst + sgst + igst + shipping;

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Swal.fire(
        "Select Address",
        "Please choose a delivery address.",
        "warning"
      );
      return;
    }

    if (paymentMethod === "gpay") {
      if (!upiId) {
        Swal.fire("Missing Details", "Please enter your UPI ID.", "error");
        return;
      }
      Swal.fire("Redirecting to GPay...", `UPI ID: ${upiId}`, "info").then(
        () => {
          successAlert();
        }
      );
    } else if (paymentMethod === "netbanking") {
      if (!netBanking.bankName || !netBanking.accountNumber) {
        Swal.fire("Missing Details", "Please enter bank details.", "error");
        return;
      }
      Swal.fire(
        "Redirecting to Net Banking...",
        `Bank: ${netBanking.bankName}`,
        "info"
      ).then(() => {
        successAlert();
      });
    } else if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        Swal.fire("Missing Details", "Please enter all card details.", "error");
        return;
      }
      Swal.fire("Processing Card Payment...", "Please wait...", "info").then(
        () => {
          successAlert();
        }
      );
    } else if (paymentMethod === "cod") {
      Swal.fire(
        "Cash on Delivery Selected",
        "You will pay at the time of delivery.",
        "info"
      ).then(() => {
        successAlert();
      });
    }
  };

  const successAlert = () => {
    Swal.fire({
      title: "Order Placed!",
      text: `Your order of ₹${total.toFixed(
        2
      )} has been placed successfully.\n\nDelivery Address:\n${selectedAddress}`,
      icon: "success",
      confirmButtonText: "OK",
    }).then((res) => {
      if (res.isConfirmed) {
        clearCart();
        window.location.href = "/";
      }
    });
  };

  // ✅ List of banks
  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Kotak Mahindra Bank",
    "Yes Bank",
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          paddingTop: "70px",
          flexWrap: "wrap",
          flexDirection: { xs: "column", md: "row" },
          pb: 3,
        }}
      >
        {/* Address Section */}
        <Box
          sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" }, minWidth: "280px" }}
        >
          <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Select Delivery Address
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {addresses.length === 0 ? (
              <Box textAlign="center">
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  No saved addresses. Please add an address in "Manage
                  Addresses" page.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/address")}
                >
                  Manage Address
                </Button>
              </Box>
            ) : (
              <RadioGroup
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                sx={{ gap: 2 }}
              >
                {addresses.map((addr, idx) => {
                  const addrValue = `${addr.name}, ${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}, Ph: ${addr.mobile}`;
                  const isSelected = selectedAddress === addrValue;

                  return (
                    <FormControlLabel
                      key={idx}
                      value={addrValue}
                      control={<Radio />}
                      label={
                        <Card
                          sx={{
                            borderRadius: 2,
                            p: 2,
                            boxShadow: isSelected
                              ? "0 6px 20px rgba(33, 150, 243, 0.3)"
                              : "0 3px 10px rgba(0,0,0,0.1)",
                            border: isSelected
                              ? "2px solid #2196f3"
                              : "1px solid #eee",
                            background: isSelected
                              ? "linear-gradient(135deg, #e3f2fd, #ffffff)"
                              : "#fff",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <Typography fontWeight="bold" variant="subtitle1">
                            {addr.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {addr.street}, {addr.city}, {addr.state} -{" "}
                            {addr.pincode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            📞 {addr.mobile}
                          </Typography>
                        </Card>
                      }
                      sx={{ alignItems: "flex-start" }}
                    />
                  );
                })}
              </RadioGroup>
            )}
          </Card>
        </Box>

        {/* Payment Section */}
        <Box
          sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" }, minWidth: "280px" }}
        >
          <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Choose Payment Method
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="gpay"
                control={<Radio />}
                label="Google Pay / UPI"
              />
              <FormControlLabel
                value="netbanking"
                control={<Radio />}
                label="Net Banking"
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Debit / Credit Card"
              />
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash on Delivery"
              />
            </RadioGroup>

            {/* ✅ UPI Fields */}
            {paymentMethod === "gpay" && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="UPI ID"
                  variant="standard"
                  margin="dense"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </Box>
            )}

            {/* ✅ Net Banking Fields */}
            {paymentMethod === "netbanking" && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth variant="standard" margin="dense">
                  <InputLabel>Select Bank</InputLabel>
                  <Select
                    value={netBanking.bankName}
                    onChange={(e) =>
                      setNetBanking({ ...netBanking, bankName: e.target.value })
                    }
                  >
                    {banks.map((bank, index) => (
                      <MenuItem key={index} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Account Number"
                  variant="standard"
                  margin="dense"
                  value={netBanking.accountNumber}
                  onChange={(e) =>
                    setNetBanking({
                      ...netBanking,
                      accountNumber: e.target.value,
                    })
                  }
                />
              </Box>
            )}

            {/* ✅ Card Fields */}
            {paymentMethod === "card" && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Card Number"
                  variant="standard"
                  margin="dense"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  variant="standard"
                  margin="dense"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="CVV"
                  variant="standard"
                  type="password"
                  margin="dense"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* Order Summary */}
      <Card
        sx={{
          p: 3,
          boxShadow: 4,
          borderRadius: 3,
          bgcolor: "#fafafa",
          mt: 3,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Order Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {cartItems.length === 0 ? (
          <Typography color="text.secondary">No items in cart.</Typography>
        ) : (
          <>
            <List sx={{ maxHeight: 250, overflowY: "auto", mb: 2 }}>
              {cartItems.map((item, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    borderBottom: "1px solid #eee",
                    pb: 1,
                  }}
                >
                  {item.image && (
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        mr: 2,
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <ListItemText
                    primary={item.name}
                    secondary={`Qty: ${item.quantity}`}
                    primaryTypographyProps={{ fontWeight: "500", fontSize: 15 }}
                    secondaryTypographyProps={{
                      fontSize: 13,
                      color: "text.secondary",
                    }}
                  />

                  <Typography
                    fontWeight="bold"
                    sx={{ minWidth: 70, textAlign: "right" }}
                  >
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="500">₹{subtotal.toFixed(2)}</Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography color="text.secondary">Discount (10%)</Typography>
                <Typography fontWeight="500" color="error">
                  - ₹{discount.toFixed(2)}
                </Typography>
              </Box>

              {/* ✅ GST Split */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography color="text.secondary">CGST (9%)</Typography>
                <Typography fontWeight="500" color="primary">
                  + ₹{cgst.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography color="text.secondary">SGST (9%)</Typography>
                <Typography fontWeight="500" color="primary">
                  + ₹{sgst.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography color="text.secondary">IGST (0%)</Typography>
                <Typography fontWeight="500" color="primary">
                  + ₹{igst.toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight="500">
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
                sx={{ mt: 3, borderRadius: 2 }}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
};

export default Payment;
