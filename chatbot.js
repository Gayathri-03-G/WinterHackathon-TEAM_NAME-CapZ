import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";

export default function ChatBot({ subject, notes }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    const res = await axios.post("YOUR_MAKE_WEBHOOK_URL", {
      subject: subject,
      notes: notes,
      question: input
    });

    const aiMsg = { role: "ai", text: res.data.answer };
    setMessages(m => [...m, aiMsg]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {messages.map((m, i) => (
          <Text key={i} style={{ color: m.role === "ai" ? "#00ffff" : "#fff" }}>
            {m.text}
          </Text>
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={{ flex: 1, color: "white", borderWidth: 1 }}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about this lecture..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={{ color: "#00ffff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
