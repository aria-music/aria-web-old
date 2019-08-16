<template>
	<v-dialog
		v-model="showDialog"
		max-width="450px"
		@keydown.enter="input()"
	>
		<v-card>
			<v-card-text>
				<span class="headline">New Playlist</span>
			</v-card-text>
			<v-container grid-list-xs>
				<v-layout row wrap>
					<v-flex xs12>
						<v-text-field
							v-model="newName"
							:error="error"
							label="Title"
							counter
							maxlength="30"
							ref="field"
							@focus="isFocus = true"
							@blur="isFocus = false"
						></v-text-field>
					</v-flex>
					<v-flex>
						<v-layout justify-end>
							<v-btn
								flat
								@click="close()"
							>cancel</v-btn>
							<v-btn
								color="primary"
								@click="addPlaylist()"
							>save</v-btn>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-container>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	data: () => ({
		showDialog: false,
		error: false,
		newName: "",
		isFocus: false,
	}),
	props: {
		dialog: {
			type: Boolean,
      required: true
		}
	},
	watch: {
		dialog: function() {
			this.showDialog = true
		},
		showDialog: function() {
			if(!this.showDialog) this.close()
		},
	},
	methods: {
		input() {
			if(this.isFocus) this.addPlaylist()
			else this.focusFeild()
		},
		focusFeild() {
			this.$refs.field.focus()
		},
    addPlaylist() {
			if(this.newName == "") this.error = true
			else {
				this.$store.dispatch('sendAsNewplaylist', this.newName)
				this.close()
			}
    },
		close() {
			this.newName = ""
			this.error = false
			this.showDialog = false
		},
	},
}
</script>