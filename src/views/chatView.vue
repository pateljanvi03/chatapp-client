<template>
  <div>
    <div class="m-2 flex h-screen w-screen justify-center overflow-hidden bg-gray-100 p-6">
      <div
        class="flex h-full w-full overflow-hidden rounded-lg bg-white shadow ring-1 ring-black ring-opacity-5"
      >
        <div class="h-full w-96 overflow-hidden border-r">
          
          
          <div class="border-b px-6 py-5 flex place-content-between">
            <input
              v-if="searchUser"
              v-model="searchUserFilter.name"
              @change="searchForUser"
              class="block-2 w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm sm:text-sm"
              placeholder="Search Conversation"
            />
            <div v-else class="font-semibold text-lg "> {{authUser.name}} </div>
            <button class="ml-2 bg-slate-200 px-4 rounded-md text-lg place-content-end" @click="getConversation" v-if="!searchUser">+</button>
            <button class="ml-2 bg-slate-200 px-4 rounded-md text-lg" @click="backButton" v-else>Back</button>
          </div>

          <div class="h-full overflow-auto" v-if="!searchUser">

            <div class="mb-4">
            <ul role="list" class="relative z-0 divide-y divide-gray-200">
              <li
                class="bg-white cursor-pointer"
                @click="selectConversation(filteredConversation)"
                v-for="filteredConversation in filteredConversations"
                :key="filteredConversation._id"
              >
                <div
                  class="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50"
                >
                  <div class="flex-shrink-0">
                    <img
                      class="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                      alt
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="focus:outline-none">
                      <!-- Extend touch target to entire panel -->
                      <span class="inset-0" aria-hidden="true"></span>
                      <p
                        class="text-sm font-medium text-gray-900"
                      >{{filteredConversation.otherUser.name}}</p>
                      <p
                        class="truncate text-sm text-gray-500"
                      >{{filteredConversation.lastMessageBody}}</p>
                    </div>
                  </div>

                  <span
                    class="text-sm text-gray-400 absolute top-3 right-3"
                  >{{filteredConversation.formatedDateUpdated }}</span>
                </div>
              </li>
            </ul>
            </div>

            <div
              class="my-4 text-center text-slate-700 cursor-pointer"
              v-if="conversations.length == (messageFilter.limit * messageFilter.page)"
              @click="loadMoreConversations"
            >
            Load more conversation
            </div>
          </div>

          <!-- search user -->

          <div class="h-full overflow-auto" v-else>
            <div class="mb-4">
            <ul role="list" class="relative z-0 divide-y divide-gray-200">
              <li
                class="bg-white cursor-pointer"
                v-for="user in users"
                :key="user._id"
              >
                <div
                  class="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50"
                >
                  <div class="flex-shrink-0">
                    <img
                      class="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                      alt
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="focus:outline-none">
                      <!-- Extend touch target to entire panel -->
                      <span class="inset-0" aria-hidden="true"></span>
                      <p
                        class="text-sm font-medium text-gray-900"
                      >{{user.name}}</p>
                    </div>
                  </div>
                  <button class="ml-2 bg-slate-200 px-4 py-1 rounded-md text-lg " @click="createConversation(user)">
                    +
                  </button>
                </div>
              </li>
            </ul>
            </div>

            <div
              class="my-4 text-center text-slate-700 cursor-pointer"
              v-if="users.length == (searchUserFilter.limit * searchUserFilter.page)"
              @click="loadMoreUsers"
            >
            Load more Users
            </div>
          </div>

        </div>

        <div class="grow overflow-hidden flex flex-col" v-if="selectedConversation">
          <div>
            <div
              class="relative flex items-center space-x-3 border-b px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50"
            >
              <div class="flex-shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
                  alt
                />
              </div>
              <div class="min-w-0 flex-1">
                <!-- Extend touch target to entire panel -->
                <span class="inset-0" aria-hidden="true"></span>
                <p class="text-sm font-medium text-gray-900">{{selectedConversation.otherUser.name}}</p>
              </div>
            </div>
          </div>

          <div class="grow px-4 overflow-y-auto h-full">
            <div
              class="my-4 text-center text-slate-700 cursor-pointer"
              v-if="messages.length == (messageFilter.limit * messageFilter.page)"
              @click="loadMoreMessages"
            >
            Load older messages
            </div>
            <div v-else class="my-4"></div>

            <div class="mb-4">
              <div
                v-for="message in reverseMessages"
                :key="message._id"
                class="mb-4 flex"
                :class="message.senderUserId !== authUser._id? '' : 'place-content-end'"
              >
                <div>
                  <span class="bg-gray-200 py-3 px-4 rounded-lg">{{message.body}}</span>
                  <p class="text-gray-300 text-sm mt-3 pl-1">{{ message.formatedDateAdded }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="h-20 border-t-2 p-3">
            <div class="flex">
              <textarea
                v-model="message"
                class="mr-2 block-2 w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm sm:text-sm"
                placeholder="Search Conversation"
              ></textarea>

              <button
                @click="sendMessage"
                class="relative h-10 flex-none rounded-md text-sm font-semibold leading-6 py-1.5 px-3 hover:bg-blue-400 bg-blue-500 text-white shadow-sm dark:shadow-highlight/20"
              >Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { io } from 'socket.io-client'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      conversations: [],
      authUser: '',
      messages: [],
      message: '',
      messageFilter: {
        selectedConversationId: '',
        page: 1,
        limit: 1,
      },
      conversationFilter: {
        page: 1,
        limit: 4,
      },
      selectedConversation: '',
      users: [],
      searchUser: false,
      searchUserFilter: {
        name: "",
        page:1,
        limit: 4
      }
    }
  },
  created() {
    this.authUser = JSON.parse(localStorage.getItem('authUser'))

    this.loadData()
    const socket = io(import.meta.env.VUE_APP_SERVER_URL || 'http://localhost:5001', {
      transports: ['websocket'],
    })
    socket.emit('send-request', {
      body: 'osp',
    })

    socket.on('new-conversation-message' + this.authUser._id, (payload) => {
      this.messages.splice(0, 0, payload)
    })

    socket.on('conversation_' + this.authUser._id, (payload) => {
      const indexOfUpdatedConversation = this.conversations.findIndex(
        (x) => x._id == payload._id
      )
      if (indexOfUpdatedConversation !== -1) {
        this.$set(this.conversations, indexOfUpdatedConversation, payload)
      } else {
        this.conversations.splice(0, 0, payload)
      }
    })
  },
  computed: {
    filteredConversations() {
      return this.conversations
        .map((x) => {
          x.formatedDateUpdated = dayjs(x.updatedAt).format('DD/MM h:mm A')
          x.otherUser = x.user.find((y) => y._id != this.authUser._id)
          return x
        })
        .filter((x) => x)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    },
    reverseMessages() {
      return this.messages
        .filter((x) => x)
        .map((x) => {
          x.formatedDateAdded = dayjs(x.dateAdded).format('DD/MM h:mm A')
          return x
        })
        .reverse()
    },
  },
  methods: {
    async loadData() {
      const response = await axios.get('/conversation', {
        params: {
          page: this.conversationFilter.page,
          limit: this.conversationFilter.limit,
        },
      })
      this.conversations = this.conversations.concat(response.data.conversations);
    },
    async selectConversation(conversation) {
      this.messageFilter.selectedConversationId = conversation._id
      this.selectedConversation = conversation

      this.messages = []
      this.messageFilter.page = 1

      this.loadMessages()
    },
    async loadMessages() {
      const response = await axios.get('/messages', {
        params: {
          conversationId: this.messageFilter.selectedConversationId,
          page: this.messageFilter.page,
          limit: this.messageFilter.limit,
        },
      })
      this.messages = this.messages.concat(response.data.messages)
    },
    async sendMessage() {
      await axios.post('/messages', {
        body: this.message,
        senderUserId: this.authUser._id,
        conversationId: this.messageFilter.selectedConversationId,
      })
      this.message = ''
    },
    async loadMoreMessages() {
      this.messageFilter.page++
      this.loadMessages()
    },
    async loadMoreConversations() {
      this.conversationFilter.page++
      this.loadData()
    },
    async loadMoreUsers() {
      this.searchUserFilter.page++;
      this.getConversation()   
      },
    async getConversation() {
      this.searchUser = true;
      const response = await axios.get('/users',{
        params: this.searchUserFilter
      });
      this.users = this.users.concat(response.data.users);
    },
    async searchForUser() {
      this.users = [];
      this.searchUserFilter.page = 1;
      this.getConversation();
    },
    async createConversation(user) {
      await axios.post('/conversation', {
        userId: user._id
      })
      this.conversations = [];
      this.loadData();
    },
    async backButton() {
      this.searchUser = false,
      this.users = [];
    }
  },
}
</script>