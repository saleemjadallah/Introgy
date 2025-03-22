import UIKit
import SwiftUI

class AnimatedDialog: UIView {
    // MARK: - Properties
    private let title: String
    private let message: String
    private let buttonTitle: String
    private let action: () -> Void
    
    private lazy var containerView: UIView = {
        let view = UIView()
        view.backgroundColor = DesignSystem.Colors.background
        view.layer.cornerRadius = DesignSystem.Layout.cornerRadius
        view.addShadow(opacity: 0.2)
        return view
    }()
    
    private lazy var stackView: UIStackView = {
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = DesignSystem.Layout.standardSpacing
        stack.alignment = .center
        return stack
    }()
    
    private lazy var titleLabel: UILabel = {
        let label = UILabel()
        label.font = DesignSystem.Typography.headingFont
        label.textColor = DesignSystem.Colors.text
        label.textAlignment = .center
        label.numberOfLines = 0
        return label
    }()
    
    private lazy var messageLabel: UILabel = {
        let label = UILabel()
        label.font = DesignSystem.Typography.bodyFont
        label.textColor = DesignSystem.Colors.text.withAlphaComponent(0.8)
        label.textAlignment = .center
        label.numberOfLines = 0
        return label
    }()
    
    private lazy var actionButton: UIButton = {
        let button = UIButton(type: .system)
        button.titleLabel?.font = DesignSystem.Typography.bodyFont
        button.setTitleColor(DesignSystem.Colors.primary, for: .normal)
        button.backgroundColor = DesignSystem.Colors.background
        button.layer.cornerRadius = DesignSystem.Layout.cornerRadius / 2
        button.addShadow()
        button.addTarget(self, action: #selector(buttonTapped), for: .touchUpInside)
        return button
    }()
    
    // MARK: - Initialization
    init(title: String, message: String, buttonTitle: String, action: @escaping () -> Void) {
        self.title = title
        self.message = message
        self.buttonTitle = buttonTitle
        self.action = action
        super.init(frame: .zero)
        setupViews()
    }
    
    required init?(coder: NSCoder) {
        self.title = ""
        self.message = ""
        self.buttonTitle = ""
        self.action = {}
        super.init(coder: coder)
        setupViews()
    }
    
    // MARK: - Setup
    private func setupViews() {
        backgroundColor = UIColor.black.withAlphaComponent(0.5)
        
        addSubview(containerView)
        containerView.addSubview(stackView)
        
        titleLabel.text = title
        messageLabel.text = message
        actionButton.setTitle(buttonTitle, for: .normal)
        
        stackView.addArrangedSubview(titleLabel)
        stackView.addArrangedSubview(messageLabel)
        stackView.addArrangedSubview(actionButton)
        
        setupConstraints()
        setupAnimations()
    }
    
    private func setupConstraints() {
        containerView.translatesAutoresizingMaskIntoConstraints = false
        stackView.translatesAutoresizingMaskIntoConstraints = false
        actionButton.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            containerView.centerXAnchor.constraint(equalTo: centerXAnchor),
            containerView.centerYAnchor.constraint(equalTo: centerYAnchor),
            containerView.widthAnchor.constraint(equalTo: widthAnchor, multiplier: 0.8),
            
            stackView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: DesignSystem.Layout.standardSpacing),
            stackView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: DesignSystem.Layout.standardSpacing),
            stackView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -DesignSystem.Layout.standardSpacing),
            stackView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -DesignSystem.Layout.standardSpacing),
            
            actionButton.heightAnchor.constraint(equalToConstant: DesignSystem.Layout.buttonHeight),
            actionButton.widthAnchor.constraint(equalTo: stackView.widthAnchor)
        ])
    }
    
    private func setupAnimations() {
        // Initial state
        alpha = 0
        containerView.transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
        
        // Animate in
        UIView.animate(
            withDuration: DesignSystem.Animations.standardDuration,
            delay: 0,
            usingSpringWithDamping: DesignSystem.Animations.springDamping,
            initialSpringVelocity: DesignSystem.Animations.initialSpringVelocity,
            options: .curveEaseOut,
            animations: {
                self.alpha = 1
                self.containerView.transform = .identity
            }
        )
    }
    
    // MARK: - Actions
    @objc private func buttonTapped() {
        UIView.animate(
            withDuration: DesignSystem.Animations.standardDuration,
            animations: {
                self.alpha = 0
                self.containerView.transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
            }
        ) { _ in
            self.removeFromSuperview()
            self.action()
        }
    }
    
    // MARK: - Public Methods
    static func show(in view: UIView, title: String, message: String, buttonTitle: String, action: @escaping () -> Void) {
        let dialog = AnimatedDialog(title: title, message: message, buttonTitle: buttonTitle, action: action)
        dialog.frame = view.bounds
        view.addSubview(dialog)
    }
}

// MARK: - SwiftUI Preview
struct AnimatedDialog_Preview: PreviewProvider {
    static var previews: some View {
        ZStack {
            Color.gray.opacity(0.3)
            
            VStack {
                Text("Background Content")
                    .font(.title)
                    .foregroundColor(.gray)
            }
            
            AnimatedDialogRepresentable(
                title: "Success!",
                message: "Your action was completed successfully.",
                buttonTitle: "OK",
                action: {}
            )
        }
        .edgesIgnoringSafeArea(.all)
    }
}

struct AnimatedDialogRepresentable: UIViewRepresentable {
    let title: String
    let message: String
    let buttonTitle: String
    let action: () -> Void
    
    func makeUIView(context: Context) -> AnimatedDialog {
        return AnimatedDialog(
            title: title,
            message: message,
            buttonTitle: buttonTitle,
            action: action
        )
    }
    
    func updateUIView(_ uiView: AnimatedDialog, context: Context) {}
}
